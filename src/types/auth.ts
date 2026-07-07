export interface LoginParams {
  username: string
  password: string
  code: string
  tenantId: string
  grant_type: 'password'
  scope: 'all'
  type: 'account'
}

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
