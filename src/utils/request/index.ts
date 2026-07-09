import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios, { AxiosHeaders } from 'axios'
import { message } from 'antd'
import { runtimeConfig } from '@/app/runtimeConfig'
import { expireLoginSession, getLoginSessionAccessToken, refreshLoginSession } from '@/api/session'

/**
 * 后端业务响应码，兼容数字和字符串两种常见格式。
 */
export type ApiCode = number | string

/**
 * 后端统一业务响应结构。
 *
 * @template T 业务数据类型。
 */
export interface ApiResponse<T> {
  code?: ApiCode
  data?: T
  msg?: string
  message?: string
  success?: boolean
}

/**
 * 业务请求配置。
 *
 * @template D 请求体数据类型。
 */
export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  /** 是否直接返回原始 Axios 响应。 */
  rawResponse?: boolean
  /** 是否展示全局错误提示。 */
  showError?: boolean
  /** 是否跳过访问令牌注入。 */
  skipToken?: boolean
  /** 是否跳过刷新令牌重试。 */
  skipRefresh?: boolean
}

interface InternalRequestConfig<D = unknown> extends InternalAxiosRequestConfig<D> {
  rawResponse?: boolean
  showError?: boolean
  skipToken?: boolean
  skipRefresh?: boolean
  _retry?: boolean
}

const SUCCESS_CODES = new Set<ApiCode>([0, 200, '0', '200'])
const UNAUTHORIZED_CODES = new Set<ApiCode>([401, '401'])

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '登录会话已过期，请重新登录',
  403: '没有权限访问该资源',
  404: '请求的资源不存在',
  408: '请求超时，请稍后重试',
  500: '服务器异常，请稍后重试',
  502: '网关异常，请稍后重试',
  503: '服务暂不可用，请稍后重试',
  504: '网关超时，请稍后重试',
}

/**
 * request module 统一抛出的业务请求错误。
 *
 * @remarks 保留原始响应，便于上层在需要时读取状态码或响应体。
 */
export class RequestError extends Error {
  constructor(
    messageText: string,
    public readonly response?: AxiosResponse,
  ) {
    super(messageText)
    this.name = 'RequestError'
  }
}

/**
 * 底层 Axios 实例；优先使用 `request` 及快捷方法完成业务调用。
 */
export const requestClient = axios.create({
  baseURL: runtimeConfig.apiBaseURL,
  timeout: runtimeConfig.requestTimeoutMs,
})

/**
 * 判断未知响应体是否符合常见业务响应结构。
 *
 * @param value 待判断的响应体。
 * @returns 如果响应体包含业务响应关键字段则返回 `true`。
 */
function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return value !== null
    && typeof value === 'object'
    && ('code' in value || 'success' in value || 'data' in value || 'msg' in value || 'message' in value)
}

/**
 * 判断业务响应是否表示成功。
 *
 * @param response 业务响应体。
 * @returns 成功码或 `success: true` 时返回 `true`。
 */
function isBusinessSuccess(response: ApiResponse<unknown>): boolean {
  return response.success === true || (response.code !== undefined && SUCCESS_CODES.has(response.code))
}

/**
 * 判断业务响应是否表示登录会话需要恢复。
 *
 * @param response 业务响应体。
 * @returns 业务码为 `401` 或 `'401'` 时返回 `true`。
 */
function isBusinessUnauthorized(response: ApiResponse<unknown>): boolean {
  return response.code !== undefined && UNAUTHORIZED_CODES.has(response.code)
}

/**
 * 读取业务错误提示文案。
 *
 * @param response 业务响应体。
 * @returns 优先来自后端的 `msg` 或 `message`，否则返回通用错误文案。
 */
function getBusinessMessage(response: ApiResponse<unknown>): string {
  return response.msg || response.message || '请求失败，请稍后重试'
}

/**
 * 判断当前请求是否允许展示全局错误提示。
 *
 * @param config 请求配置。
 * @returns 未显式关闭 `showError` 时返回 `true`。
 */
function shouldShowError(config?: RequestConfig | InternalRequestConfig): boolean {
  return config?.showError !== false
}

/**
 * 按请求配置展示全局错误提示。
 *
 * @param errorMessage 错误文案。
 * @param config 请求配置。
 */
function showRequestError(errorMessage: string, config?: RequestConfig | InternalRequestConfig): void {
  if (shouldShowError(config)) {
    void message.error(errorMessage)
  }
}

/**
 * 将 Axios 错误映射为用户可读的中文错误文案。
 *
 * @param error Axios 错误对象。
 * @returns 可展示给用户或调用方的错误文案。
 */
function normalizeHttpErrorMessage(error: AxiosError): string {
  if (error.code === 'ECONNABORTED') {
    return '请求超时，请稍后重试'
  }

  if (!error.response) {
    return '网络异常，请检查网络连接'
  }

  const responseData = error.response.data

  if (isApiResponse(responseData)) {
    return responseData.msg
      || responseData.message
      || HTTP_STATUS_MESSAGES[error.response.status]
      || '请求失败，请稍后重试'
  }

  return HTTP_STATUS_MESSAGES[error.response.status] || '请求失败，请稍后重试'
}

/**
 * 解包业务响应。
 *
 * @param response Axios 原始响应。
 * @returns 业务数据、原始响应或 Blob 数据。
 * @throws 当业务响应表示失败时抛出 `RequestError`。
 */
function unwrapResponse<T>(response: AxiosResponse): T {
  const config = response.config as InternalRequestConfig

  if (config.rawResponse) {
    return response as T
  }

  if (config.responseType === 'blob') {
    return response.data as T
  }

  const data = response.data

  if (!isApiResponse(data)) {
    return data as T
  }

  if (isBusinessSuccess(data)) {
    return data.data as T
  }

  throw new RequestError(getBusinessMessage(data), response)
}

/**
 * 使用刷新令牌恢复登录会话并重放原请求。
 *
 * @param config 需要重放的请求配置。
 * @returns 重放请求的 Axios 响应。
 * @throws 当请求已重试、禁用刷新、刷新失败或重放失败时抛出错误。
 */
async function replayRequestAfterRefresh<T = unknown>(config: InternalRequestConfig): Promise<AxiosResponse<T>> {
  if (config._retry || config.skipRefresh) {
    expireLoginSession()
    throw new RequestError('登录会话已过期，请重新登录')
  }

  config._retry = true

  try {
    const data = await refreshLoginSession()
    config.headers = AxiosHeaders.from(config.headers)
    config.headers.set('Blade-Auth', `bearer ${data.access_token}`)
    return requestClient(config)
  }
  catch (refreshError) {
    expireLoginSession()
    throw refreshError instanceof Error ? refreshError : new RequestError('登录会话已过期，请重新登录')
  }
}

requestClient.interceptors.request.use((config) => {
  const requestConfig = config as InternalRequestConfig
  const headers = AxiosHeaders.from(config.headers)
  const token = getLoginSessionAccessToken()

  if (!requestConfig.skipToken && token) {
    headers.set('Blade-Auth', `bearer ${token}`)
  }
  else if (requestConfig.skipToken) {
    headers.delete('Blade-Auth')
  }

  if (config.data instanceof FormData) {
    // 让浏览器自行生成 multipart boundary，避免手动 Content-Type 破坏上传请求。
    headers.set('Content-Type', false)
  }

  if (config.data instanceof URLSearchParams && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
  }

  config.headers = headers
  return config
})

requestClient.interceptors.response.use(
  response => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error)
    }

    try {
      return await replayRequestAfterRefresh(error.config as InternalRequestConfig)
    }
    catch (refreshError) {
      return Promise.reject(refreshError instanceof Error ? refreshError : error as AxiosError)
    }
  },
)

/**
 * 发送业务请求并返回解包后的业务数据。
 *
 * @param config 请求配置。
 * @returns 解包后的业务数据，或在 `rawResponse` / `blob` 场景返回特殊响应数据。
 * @throws 当 HTTP 请求失败、业务响应失败或登录会话恢复失败时抛出 `RequestError` 或原始错误。
 */
export async function request<T = unknown, D = unknown>(config: RequestConfig<D>): Promise<T> {
  let response: AxiosResponse

  try {
    response = await requestClient.request(config)
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = normalizeHttpErrorMessage(error)
      showRequestError(errorMessage, error.config as InternalRequestConfig | undefined)
      throw new RequestError(errorMessage, error.response)
    }

    throw error
  }

  try {
    return unwrapResponse<T>(response)
  }
  catch (error) {
    if (error instanceof RequestError) {
      if (
        error.response
        && isApiResponse(error.response.data)
        && isBusinessUnauthorized(error.response.data)
      ) {
        const retriedResponse = await replayRequestAfterRefresh<T>(error.response.config as InternalRequestConfig)
        return unwrapResponse<T>(retriedResponse)
      }

      showRequestError(error.message, response.config as InternalRequestConfig)
    }

    throw error
  }
}

/**
 * 发送 GET 业务请求。
 *
 * @param url 请求地址。
 * @param config 请求配置。
 * @returns 解包后的业务数据。
 */
export function get<T = unknown>(url: string, config: RequestConfig = {}): Promise<T> {
  return request<T>({ ...config, url, method: 'get' })
}

/**
 * 发送 POST 业务请求。
 *
 * @param url 请求地址。
 * @param data 请求体数据。
 * @param config 请求配置。
 * @returns 解包后的业务数据。
 */
export function post<T = unknown, D = unknown>(url: string, data?: D, config: RequestConfig<D> = {}): Promise<T> {
  return request<T, D>({ ...config, url, method: 'post', data })
}

/**
 * 发送 PUT 业务请求。
 *
 * @param url 请求地址。
 * @param data 请求体数据。
 * @param config 请求配置。
 * @returns 解包后的业务数据。
 */
export function put<T = unknown, D = unknown>(url: string, data?: D, config: RequestConfig<D> = {}): Promise<T> {
  return request<T, D>({ ...config, url, method: 'put', data })
}

/**
 * 发送 DELETE 业务请求。
 *
 * @param url 请求地址。
 * @param config 请求配置。
 * @returns 解包后的业务数据。
 */
export function del<T = unknown>(url: string, config: RequestConfig = {}): Promise<T> {
  return request<T>({ ...config, url, method: 'delete' })
}

/**
 * 发送表单类 POST 业务请求。
 *
 * @param url 请求地址。
 * @param data 表单请求体，支持 `URLSearchParams` 或 `FormData`。
 * @param config 请求配置。
 * @returns 解包后的业务数据。
 */
export function postForm<T = unknown, D = URLSearchParams | FormData>(
  url: string,
  data: D,
  config: RequestConfig<D> = {},
): Promise<T> {
  return request<T, D>({ ...config, url, method: 'post', data })
}
