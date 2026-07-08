import { describe, expect, it } from 'vitest'
import { runtimeConfig } from '@/app/runtimeConfig'

describe('运行时配置 module', () => {
  it('提供请求和 Blade 认证配置默认值', () => {
    expect(runtimeConfig).toMatchObject({
      apiBaseURL: '',
      requestTimeoutMs: 20_000,
      bladeTenantId: '000000',
      bladeClientId: 'saber',
      bladeClientSecret: 'saber_secret',
    })
  })
})
