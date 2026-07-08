import { beforeEach, describe, expect, it, vi } from 'vitest'
import { refreshLoginApi } from '@/api/auth'
import { getCacheRefreshToken, getCacheTenantId, getCacheToken } from '@/utils/cache'
import {
  expireLoginSession,
  getLoginSessionAccessToken,
  isAuthenticated,
  login,
  logout,
  refreshLoginSession,
  subscribeLoginSessionExpired,
} from '@/api/session'

vi.mock('@/api/auth', () => ({
  loginApi: vi.fn(async () => ({
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    tenant_id: '000000',
  })),
  refreshLoginApi: vi.fn(async () => ({
    access_token: 'next-access-token',
    refresh_token: 'next-refresh-token',
    tenant_id: '000000',
  })),
}))

describe('登录会话', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('登录后集中持久化访问令牌、刷新令牌和租户 ID', async () => {
    await login(' shuke ', ' zhang123456 ')

    expect(getLoginSessionAccessToken()).toBe('access-token')
    expect(getCacheToken()).toBe('access-token')
    expect(getCacheRefreshToken()).toBe('refresh-token')
    expect(getCacheTenantId()).toBe('000000')
    expect(isAuthenticated()).toBe(true)
  })

  it('退出登录会清理登录会话', async () => {
    await login('shuke', 'zhang123456')

    logout()

    expect(getLoginSessionAccessToken()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('使用刷新令牌续期并更新登录会话', async () => {
    await login('shuke', 'zhang123456')

    await refreshLoginSession()

    expect(refreshLoginApi).toHaveBeenCalledWith('refresh-token')
    expect(getLoginSessionAccessToken()).toBe('next-access-token')
    expect(getCacheRefreshToken()).toBe('next-refresh-token')
    expect(isAuthenticated()).toBe(true)
  })

  it('并发续期会复用同一个刷新请求', async () => {
    await login('shuke', 'zhang123456')

    await Promise.all([
      refreshLoginSession(),
      refreshLoginSession(),
      refreshLoginSession(),
    ])

    expect(refreshLoginApi).toHaveBeenCalledTimes(1)
  })

  it('登录会话过期时清理缓存并通知订阅者', async () => {
    const handleExpired = vi.fn()
    const unsubscribe = subscribeLoginSessionExpired(handleExpired)
    await login('shuke', 'zhang123456')

    expireLoginSession('请重新登录')

    expect(getLoginSessionAccessToken()).toBeNull()
    expect(handleExpired).toHaveBeenCalledWith({ message: '请重新登录' })

    unsubscribe()
  })
})
