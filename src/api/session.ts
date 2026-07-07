import type { BladeTokenResponse } from '@/types/auth'
import { loginApi } from '@/api/auth'
import {
  clearAuthCache,
  getCacheToken,
  setCache,
  setCacheRefreshToken,
  setCacheTenantId,
  setCacheToken,
} from '@/utils/cache'

export function isAuthenticated(): boolean {
  return Boolean(getCacheToken())
}

/** 登录并持久化 Blade 令牌。 */
export async function login(username: string, password: string): Promise<BladeTokenResponse> {
  const data = await loginApi(username.trim(), password.trim())
  setCacheToken(data.access_token)
  setCacheRefreshToken(data.refresh_token)
  setCacheTenantId(data.tenant_id)
  setCache('IS_LOGGED_IN', true)
  return data
}

/** 退出登录并清理本地会话。 */
export function logout(): void {
  clearAuthCache()
}
