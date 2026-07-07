import type { BladeTokenResponse, LoginParams } from '@/types/auth'
import { md5 } from 'js-md5'
import { z } from 'zod'
import { request } from '@/utils/request'
import { parseWithSchema } from '@/utils/validation'

const BLADE_TENANT_ID = '000000'
const BLADE_CLIENT_ID = 'saber'
const BLADE_CLIENT_SECRET = 'saber_secret'

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
  return `Basic ${btoa(`${BLADE_CLIENT_ID}:${BLADE_CLIENT_SECRET}`)}`
}

function buildLoginParams(username: string, password: string): LoginParams {
  return {
    username,
    password: md5(password),
    code: '',
    tenantId: BLADE_TENANT_ID,
    grant_type: 'password',
    scope: 'all',
    type: 'account',
  }
}

/** 调用 Blade 登录接口并校验令牌响应。 */
export async function loginApi(username: string, password: string): Promise<BladeTokenResponse> {
  const response = await request.post('/api/blade-auth/oauth/token', null, {
    params: buildLoginParams(username, password),
    headers: {
      'Tenant-Id': BLADE_TENANT_ID,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': buildBladeBasicAuthHeader(),
      'Captcha-Code': '',
      'Captcha-Key': '',
    },
  })

  return parseWithSchema(bladeTokenSchema, response.data)
}
