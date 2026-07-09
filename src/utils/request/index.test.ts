import type { AxiosAdapter, AxiosHeaderValue, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { AxiosError } from 'axios'
import { message } from 'antd'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { expireLoginSession, refreshLoginSession } from '@/api/session'
import {
  del,
  get,
  post,
  postForm,
  put,
  request,
} from '@/utils/request'

const sessionState = vi.hoisted(() => ({
  accessToken: 'old-access-token',
}))

vi.mock('antd', () => ({
  message: {
    error: vi.fn(),
  },
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

interface UserResponse {
  id: string
  name: string
}

function createResponse<T>(config: InternalAxiosRequestConfig, data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }
}

describe('业务请求 public interface', () => {
  beforeEach(() => {
    sessionState.accessToken = 'old-access-token'
    vi.clearAllMocks()
  })

  it('默认解包成功业务响应并返回类型化业务数据', async () => {
    const adapter = vi.fn<AxiosAdapter>(async config => createResponse(config, {
      code: 200,
      data: { id: '1', name: '张三' },
      message: '操作成功',
    }))

    const data = await request<UserResponse>({ url: '/api/users/1', adapter })

    expect(data).toEqual({ id: '1', name: '张三' })
  })

  it('识别常见业务成功码和 success 成功标记', async () => {
    const successCases = [
      { code: 0, data: 'zero-number' },
      { code: '0', data: 'zero-string' },
      { code: 200, data: 'ok-number' },
      { code: '200', data: 'ok-string' },
      { success: true, data: 'success-flag' },
    ]

    for (const responseBody of successCases) {
      const adapter = vi.fn<AxiosAdapter>(async config => createResponse(config, responseBody))

      await expect(request<string>({ url: '/api/success', adapter })).resolves.toBe(responseBody.data)
    }
  })

  it('提供常用 REST 快捷方法', async () => {
    const calls: Array<{ method?: string, url?: string, data?: unknown }> = []
    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      calls.push({
        method: config.method,
        url: config.url,
        data: config.data,
      })

      return createResponse(config, { code: 200, data: { ok: true } })
    })

    await get('/api/users', { adapter })
    await post('/api/users', { name: '张三' }, { adapter })
    await put('/api/users/1', { name: '李四' }, { adapter })
    await del('/api/users/1', { adapter })
    await postForm('/api/login', new URLSearchParams({ username: 'admin' }), { adapter })

    expect(calls).toEqual([
      { method: 'get', url: '/api/users', data: undefined },
      { method: 'post', url: '/api/users', data: '{"name":"张三"}' },
      { method: 'put', url: '/api/users/1', data: '{"name":"李四"}' },
      { method: 'delete', url: '/api/users/1', data: undefined },
      { method: 'post', url: '/api/login', data: 'username=admin' },
    ])
  })

  it('支持原始响应和 blob 响应跳过业务解包', async () => {
    const rawAdapter = vi.fn<AxiosAdapter>(async config => createResponse(config, {
      code: 200,
      data: { total: 1, records: [] },
    }))
    const rawResponse = await request<AxiosResponse<{ code: number, data: { records: unknown[], total: number } }>>({
      url: '/api/page',
      adapter: rawAdapter,
      rawResponse: true,
    })

    expect(rawResponse.status).toBe(200)
    expect(rawResponse.data).toEqual({ code: 200, data: { total: 1, records: [] } })

    const blob = new Blob(['hello'])
    const blobAdapter = vi.fn<AxiosAdapter>(async config => createResponse(config, blob))
    const blobData = await request<Blob>({ url: '/api/export', adapter: blobAdapter, responseType: 'blob' })

    expect(blobData).toBe(blob)
  })

  it('集中处理访问令牌和请求级开关 headers', async () => {
    const inspectedRequests: Array<{
      bladeAuth: AxiosHeaderValue | null
      contentType: AxiosHeaderValue | null
      showError?: boolean
      skipRefresh?: boolean
    }> = []
    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      inspectedRequests.push({
        bladeAuth: config.headers.get('Blade-Auth') ?? null,
        contentType: config.headers.get('Content-Type') ?? null,
        showError: (config as InternalAxiosRequestConfig & { showError?: boolean }).showError,
        skipRefresh: (config as InternalAxiosRequestConfig & { skipRefresh?: boolean }).skipRefresh,
      })

      return createResponse(config, { code: 200, data: true })
    })

    await request({ url: '/api/private', adapter })
    await request({ url: '/api/public', adapter, skipToken: true })
    await request({ url: '/api/upload', method: 'post', data: new FormData(), adapter })
    await request({ url: '/api/form', method: 'post', data: new URLSearchParams({ a: '1' }), adapter })
    await request({ url: '/api/options', adapter, showError: false, skipRefresh: true })

    expect(inspectedRequests).toEqual([
      {
        bladeAuth: 'bearer old-access-token',
        contentType: null,
        showError: undefined,
        skipRefresh: undefined,
      },
      {
        bladeAuth: null,
        contentType: null,
        showError: undefined,
        skipRefresh: undefined,
      },
      {
        bladeAuth: 'bearer old-access-token',
        contentType: false,
        showError: undefined,
        skipRefresh: undefined,
      },
      {
        bladeAuth: 'bearer old-access-token',
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        showError: undefined,
        skipRefresh: undefined,
      },
      {
        bladeAuth: 'bearer old-access-token',
        contentType: null,
        showError: false,
        skipRefresh: true,
      },
    ])
  })

  it('业务失败时以 rejected promise 抛出服务端消息', async () => {
    const adapter = vi.fn<AxiosAdapter>(async config => createResponse(config, {
      code: 500,
      data: null,
      msg: '用户不存在',
    }))

    await expect(request({ url: '/api/users/missing', adapter })).rejects.toThrow('用户不存在')
    expect(message.error).toHaveBeenCalledWith('用户不存在')
  })

  it('showError 为 false 时仍抛出业务错误但不展示全局提示', async () => {
    const adapter = vi.fn<AxiosAdapter>(async config => createResponse(config, {
      code: 500,
      data: null,
      message: '保存失败',
    }))

    await expect(request({ url: '/api/users/1', adapter, showError: false })).rejects.toThrow('保存失败')
    expect(message.error).not.toHaveBeenCalled()
  })

  it('统一映射 HTTP 状态错误并优先使用服务端消息', async () => {
    const forbiddenAdapter = vi.fn<AxiosAdapter>(async (config) => {
      throw new AxiosError('Forbidden', 'ERR_BAD_REQUEST', config, null, {
        data: null,
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        config,
      })
    })

    await expect(request({ url: '/api/forbidden', adapter: forbiddenAdapter })).rejects.toThrow('没有权限访问该资源')
    expect(message.error).toHaveBeenCalledWith('没有权限访问该资源')

    vi.clearAllMocks()

    const backendMessageAdapter = vi.fn<AxiosAdapter>(async (config) => {
      throw new AxiosError('Bad Request', 'ERR_BAD_REQUEST', config, null, {
        data: { code: 400, msg: '手机号格式不正确' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
      })
    })

    await expect(request({ url: '/api/users', adapter: backendMessageAdapter })).rejects.toThrow('手机号格式不正确')
    expect(message.error).toHaveBeenCalledWith('手机号格式不正确')
  })

  it('统一映射超时和网络异常', async () => {
    const timeoutAdapter = vi.fn<AxiosAdapter>(async (config) => {
      throw new AxiosError('timeout', 'ECONNABORTED', config)
    })

    await expect(request({ url: '/api/slow', adapter: timeoutAdapter })).rejects.toThrow('请求超时，请稍后重试')
    expect(message.error).toHaveBeenCalledWith('请求超时，请稍后重试')

    vi.clearAllMocks()

    const networkAdapter = vi.fn<AxiosAdapter>(async (config) => {
      throw new AxiosError('Network Error', 'ERR_NETWORK', config)
    })

    await expect(request({ url: '/api/offline', adapter: networkAdapter })).rejects.toThrow('网络异常，请检查网络连接')
    expect(message.error).toHaveBeenCalledWith('网络异常，请检查网络连接')
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

      return createResponse(config, { code: 200, data: { ok: true } })
    })

    const data = await request({ url: '/api/users', adapter })

    expect(data).toEqual({ ok: true })
    expect(refreshLoginSession).toHaveBeenCalledTimes(1)
    expect(expireLoginSession).not.toHaveBeenCalled()
    expect(adapter).toHaveBeenCalledTimes(2)
    expect(adapter.mock.calls[1][0].headers.get('Blade-Auth')).toBe('bearer new-access-token')
  })

  it('业务 401 后使用登录会话恢复流程并重放原请求', async () => {
    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      if (adapter.mock.calls.length === 1) {
        return createResponse(config, {
          code: 401,
          data: null,
          msg: '访问令牌已过期',
        })
      }

      return createResponse(config, { code: 200, data: { ok: true } })
    })

    const data = await request({ url: '/api/users', adapter })

    expect(data).toEqual({ ok: true })
    expect(refreshLoginSession).toHaveBeenCalledTimes(1)
    expect(expireLoginSession).not.toHaveBeenCalled()
    expect(adapter).toHaveBeenCalledTimes(2)
    expect(adapter.mock.calls[1][0].headers.get('Blade-Auth')).toBe('bearer new-access-token')
  })

  it('skipRefresh 为 true 时 401 不触发刷新令牌重试', async () => {
    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, {
        data: null,
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config,
      })
    })

    await expect(request({ url: '/api/public', adapter, skipRefresh: true })).rejects.toThrow('登录会话已过期，请重新登录')

    expect(refreshLoginSession).not.toHaveBeenCalled()
    expect(expireLoginSession).toHaveBeenCalledTimes(1)
    expect(adapter).toHaveBeenCalledTimes(1)
  })

  it('重放后再次 401 时只重试一次并让登录会话过期', async () => {
    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, {
        data: null,
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config,
      })
    })

    await expect(request({ url: '/api/users', adapter })).rejects.toThrow('登录会话已过期，请重新登录')

    expect(refreshLoginSession).toHaveBeenCalledTimes(1)
    expect(expireLoginSession).toHaveBeenCalledTimes(1)
    expect(adapter).toHaveBeenCalledTimes(2)
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

    await expect(request({ url: '/api/users', adapter })).rejects.toThrow('刷新令牌失效')

    expect(expireLoginSession).toHaveBeenCalledTimes(1)
  })
})
