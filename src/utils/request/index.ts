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

export type ApiCode = number | string

export interface ApiResponse<T> {
  code?: ApiCode
  data?: T
  msg?: string
  message?: string
  success?: boolean
}

export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  rawResponse?: boolean
  showError?: boolean
  skipToken?: boolean
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

export class RequestError extends Error {
  constructor(
    messageText: string,
    public readonly response?: AxiosResponse,
  ) {
    super(messageText)
    this.name = 'RequestError'
  }
}

export const requestClient = axios.create({
  baseURL: runtimeConfig.apiBaseURL,
  timeout: runtimeConfig.requestTimeoutMs,
})

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return value !== null
    && typeof value === 'object'
    && ('code' in value || 'success' in value || 'data' in value || 'msg' in value || 'message' in value)
}

function isBusinessSuccess(response: ApiResponse<unknown>): boolean {
  return response.success === true || (response.code !== undefined && SUCCESS_CODES.has(response.code))
}

function isBusinessUnauthorized(response: ApiResponse<unknown>): boolean {
  return response.code !== undefined && UNAUTHORIZED_CODES.has(response.code)
}

function getBusinessMessage(response: ApiResponse<unknown>): string {
  return response.msg || response.message || '请求失败，请稍后重试'
}

function shouldShowError(config?: RequestConfig | InternalRequestConfig): boolean {
  return config?.showError !== false
}

function showRequestError(errorMessage: string, config?: RequestConfig | InternalRequestConfig): void {
  if (shouldShowError(config)) {
    void message.error(errorMessage)
  }
}

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

export function get<T = unknown>(url: string, config: RequestConfig = {}): Promise<T> {
  return request<T>({ ...config, url, method: 'get' })
}

export function post<T = unknown, D = unknown>(url: string, data?: D, config: RequestConfig<D> = {}): Promise<T> {
  return request<T, D>({ ...config, url, method: 'post', data })
}

export function put<T = unknown, D = unknown>(url: string, data?: D, config: RequestConfig<D> = {}): Promise<T> {
  return request<T, D>({ ...config, url, method: 'put', data })
}

export function del<T = unknown>(url: string, config: RequestConfig = {}): Promise<T> {
  return request<T>({ ...config, url, method: 'delete' })
}

export function postForm<T = unknown, D = URLSearchParams | FormData>(
  url: string,
  data: D,
  config: RequestConfig<D> = {},
): Promise<T> {
  return request<T, D>({ ...config, url, method: 'post', data })
}
