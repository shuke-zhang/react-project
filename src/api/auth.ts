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

function buildBladeBasicAuthHeader(): string {
  return `Basic ${btoa(`${runtimeConfig.bladeClientId}:${runtimeConfig.bladeClientSecret}`)}`
}

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

function buildRefreshTokenParams(refreshToken: string): RefreshTokenParams {
  return {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: 'all',
    tenantId: runtimeConfig.bladeTenantId,
  }
}

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

/** 调用 Blade 登录接口并校验令牌响应。 */
export async function loginApi(username: string, password: string): Promise<BladeTokenResponse> {
  return requestBladeToken(buildLoginParams(username, password))
}

/** 使用刷新令牌换取新的 Blade 令牌。 */
export async function refreshLoginApi(refreshToken: string): Promise<BladeTokenResponse> {
  return requestBladeToken(buildRefreshTokenParams(refreshToken))
}
