import type { BladeTokenResponse, LoginParams, RefreshTokenParams } from '@/types/auth'
import axios from 'axios'
import { md5 } from 'js-md5'
import { z } from 'zod'
import { runtimeConfig } from '@/app/runtimeConfig'
import { parseWithSchema } from '@/utils/validation'

const bladeAuthRequest = axios.create({
  baseURL: runtimeConfig.apiBaseURL,
  timeout: runtimeConfig.requestTimeoutMs,
})

const bladeTokenSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  tenant_id: z.string().min(1),
  token_type: z.string().optional(),
  expires_in: z.number().optional(),
  user_id: z.string().optional(),
  account: z.string().optional(),
  real_name: z.string().optional(),
})

/**
 * 构建 Blade OAuth 接口要求的 Basic Authorization 头。
 *
 * @returns 经过 Base64 编码的 Basic 认证头。
 */
function buildBladeBasicAuthHeader(): string {
  return `Basic ${btoa(`${runtimeConfig.bladeClientId}:${runtimeConfig.bladeClientSecret}`)}`
}

/**
 * 构建账号密码登录的 Blade OAuth 参数。
 *
 * @param username 用户名。
 * @param password 原始密码，会在请求前按 Blade 约定进行 MD5 处理。
 * @returns Blade 密码模式登录参数。
 */
function buildLoginParams(username: string, password: string): LoginParams {
  return {
    username,
    password: md5(password),
    code: '',
    tenantId: runtimeConfig.bladeTenantId,
    grant_type: 'password',
    scope: 'all',
    type: 'account',
  }
}

/**
 * 构建刷新令牌续期的 Blade OAuth 参数。
 *
 * @param refreshToken 当前登录会话持有的刷新令牌。
 * @returns Blade 刷新令牌模式参数。
 */
function buildRefreshTokenParams(refreshToken: string): RefreshTokenParams {
  return {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: 'all',
    tenantId: runtimeConfig.bladeTenantId,
  }
}

/**
 * 请求 Blade OAuth 令牌并校验响应结构。
 *
 * @param params 登录或刷新令牌的 OAuth 参数。
 * @returns 通过结构校验的 Blade 令牌响应。
 * @throws 当接口失败或响应结构不符合预期时抛出错误。
 */
async function requestBladeToken(params: LoginParams | RefreshTokenParams): Promise<BladeTokenResponse> {
  const response = await bladeAuthRequest.post('/api/blade-auth/oauth/token', null, {
    params,
    headers: {
      'Tenant-Id': runtimeConfig.bladeTenantId,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': buildBladeBasicAuthHeader(),
      'Captcha-Code': '',
      'Captcha-Key': '',
    },
  })

  return parseWithSchema(bladeTokenSchema, response.data)
}

/**
 * 调用 Blade 登录接口并校验令牌响应。
 *
 * @param username 用户名。
 * @param password 原始密码。
 * @returns 登录成功后的 Blade 令牌响应。
 * @throws 当登录失败或响应结构不符合预期时抛出错误。
 */
export async function loginApi(username: string, password: string): Promise<BladeTokenResponse> {
  return requestBladeToken(buildLoginParams(username, password))
}

/**
 * 使用刷新令牌换取新的 Blade 令牌。
 *
 * @param refreshToken 当前登录会话持有的刷新令牌。
 * @returns 续期成功后的 Blade 令牌响应。
 * @throws 当刷新令牌无效、接口失败或响应结构不符合预期时抛出错误。
 */
export async function refreshLoginApi(refreshToken: string): Promise<BladeTokenResponse> {
  return requestBladeToken(buildRefreshTokenParams(refreshToken))
}
