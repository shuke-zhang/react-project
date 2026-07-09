/**
 * Blade 密码模式登录参数。
 */
export interface LoginParams {
  username: string
  password: string
  code: string
  tenantId: string
  grant_type: 'password'
  scope: 'all'
  type: 'account'
}

/**
 * Blade 刷新令牌模式参数。
 */
export interface RefreshTokenParams {
  refresh_token: string
  grant_type: 'refresh_token'
  scope: 'all'
  tenantId: string
}

/**
 * Blade OAuth 令牌响应。
 */
export interface BladeTokenResponse {
  access_token: string
  refresh_token: string
  tenant_id: string
  token_type?: string
  expires_in?: number
  user_id?: string
  account?: string
  real_name?: string
}
