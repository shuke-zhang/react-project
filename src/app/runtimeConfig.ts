import { z } from 'zod'

const runtimeConfigSchema = z.object({
  apiBaseURL: z.string(),
  requestTimeoutMs: z.number().int().positive(),
  bladeTenantId: z.string().min(1),
  bladeClientId: z.string().min(1),
  bladeClientSecret: z.string().min(1),
})

/**
 * 应用运行时配置。
 */
export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>

/**
 * 从 Vite 环境变量读取并校验运行时配置。
 *
 * @returns 校验通过的运行时配置。
 * @throws 当环境变量无法转换为合法配置时抛出 zod 校验错误。
 */
function readRuntimeConfig(): RuntimeConfig {
  return runtimeConfigSchema.parse({
    apiBaseURL: import.meta.env.VITE_API_URL || '',
    requestTimeoutMs: Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS || 20 * 1000),
    bladeTenantId: import.meta.env.VITE_BLADE_TENANT_ID || '000000',
    bladeClientId: import.meta.env.VITE_BLADE_CLIENT_ID || 'saber',
    bladeClientSecret: import.meta.env.VITE_BLADE_CLIENT_SECRET || 'saber_secret',
  })
}

/**
 * 当前应用的运行时配置单例。
 */
export const runtimeConfig = readRuntimeConfig()
