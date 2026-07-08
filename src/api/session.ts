import type { BladeTokenResponse } from '@/types/auth'
import { loginApi, refreshLoginApi } from '@/api/auth'
import {
  clearAuthCache,
  getCacheRefreshToken,
  getCacheToken,
  setCache,
  setCacheRefreshToken,
  setCacheTenantId,
  setCacheToken,
} from '@/utils/cache'

const LOGIN_SESSION_EXPIRED_EVENT = 'auth:expired'
const DEFAULT_EXPIRED_MESSAGE = '登录会话已过期，请重新登录'

export interface LoginSessionExpiredDetail {
  message: string
}

let refreshLoginSessionPromise: Promise<BladeTokenResponse> | null = null

/** 读取当前登录会话中的访问令牌。 */
export function getLoginSessionAccessToken(): string | null {
  return getCacheToken()
}

/** 判断当前是否存在可用的登录会话。 */
export function isAuthenticated(): boolean {
  return Boolean(getCacheToken())
}

function persistLoginSession(data: BladeTokenResponse): void {
  setCacheToken(data.access_token)
  setCacheRefreshToken(data.refresh_token)
  setCacheTenantId(data.tenant_id)
  setCache('IS_LOGGED_IN', true)
}

/** 登录并持久化 Blade 令牌。 */
export async function login(username: string, password: string): Promise<BladeTokenResponse> {
  const data = await loginApi(username.trim(), password.trim())
  persistLoginSession(data)
  return data
}

/** 使用刷新令牌续期登录会话，并复用正在进行的续期请求。 */
export async function refreshLoginSession(): Promise<BladeTokenResponse> {
  if (refreshLoginSessionPromise) {
    return refreshLoginSessionPromise
  }

  const refreshToken = getCacheRefreshToken()

  if (!refreshToken) {
    throw new Error('缺少刷新令牌')
  }

  refreshLoginSessionPromise = refreshLoginApi(refreshToken)
    .then((data) => {
      persistLoginSession(data)
      return data
    })
    .finally(() => {
      refreshLoginSessionPromise = null
    })

  return refreshLoginSessionPromise
}

/** 退出登录并清理本地会话。 */
export function logout(): void {
  clearAuthCache()
}

/** 让所有入口用同一个 interface 处理登录会话过期。 */
export function expireLoginSession(message = DEFAULT_EXPIRED_MESSAGE): void {
  clearAuthCache()
  window.dispatchEvent(new CustomEvent<LoginSessionExpiredDetail>(LOGIN_SESSION_EXPIRED_EVENT, {
    detail: { message },
  }))
}

/** 订阅登录会话过期事件，返回取消订阅函数。 */
export function subscribeLoginSessionExpired(callback: (detail: LoginSessionExpiredDetail) => void): () => void {
  function handleExpired(event: Event) {
    const customEvent = event as CustomEvent<LoginSessionExpiredDetail>
    callback(customEvent.detail ?? { message: DEFAULT_EXPIRED_MESSAGE })
  }

  window.addEventListener(LOGIN_SESSION_EXPIRED_EVENT, handleExpired)
  return () => window.removeEventListener(LOGIN_SESSION_EXPIRED_EVENT, handleExpired)
}
