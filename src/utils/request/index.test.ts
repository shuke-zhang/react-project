import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { AxiosError } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { expireLoginSession, refreshLoginSession } from '@/api/session'
import { request } from '@/utils/request'

const sessionState = vi.hoisted(() => ({
  accessToken: 'old-access-token',
}))

vi.mock('@/api/session', () => ({
  expireLoginSession: vi.fn(),
  getLoginSessionAccessToken: vi.fn(() => sessionState.accessToken),
  refreshLoginSession: vi.fn(async () => {
    sessionState.accessToken = 'new-access-token'

    return {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      tenant_id: '000000',
    }
  }),
}))

function createResponse(config: InternalAxiosRequestConfig): AxiosResponse<{ ok: boolean }> {
  return {
    data: { ok: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }
}

describe('业务请求', () => {
  beforeEach(() => {
    sessionState.accessToken = 'old-access-token'
    vi.clearAllMocks()
  })

  it('401 后先刷新登录会话，再用新的访问令牌重放原请求', async () => {
    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      if (adapter.mock.calls.length === 1) {
        throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, {
          data: null,
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config,
        })
      }

      return createResponse(config)
    })

    const response = await request.get('/api/users', { adapter })

    expect(response.data).toEqual({ ok: true })
    expect(refreshLoginSession).toHaveBeenCalledTimes(1)
    expect(expireLoginSession).not.toHaveBeenCalled()
    expect(adapter).toHaveBeenCalledTimes(2)
    expect(adapter.mock.calls[1][0].headers.get('Blade-Auth')).toBe('bearer new-access-token')
  })

  it('刷新登录会话失败后清理登录会话', async () => {
    vi.mocked(refreshLoginSession).mockRejectedValueOnce(new Error('刷新令牌失效'))

    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, {
        data: null,
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config,
      })
    })

    await expect(request.get('/api/users', { adapter })).rejects.toThrow('刷新令牌失效')

    expect(expireLoginSession).toHaveBeenCalledTimes(1)
  })
})
