import { z } from 'zod'

const runtimeConfigSchema = z.object({
  apiBaseURL: z.string(),
  requestTimeoutMs: z.number().int().positive(),
  bladeTenantId: z.string().min(1),
  bladeClientId: z.string().min(1),
  bladeClientSecret: z.string().min(1),
})

/**
 * 前端应用配置。
 *
 * 配置值来自 Vite 在构建时注入的 `VITE_*` 环境变量；名称保留为 `RuntimeConfig`，
 * 用于表达应用启动后各请求模块读取的统一配置结构。
 */
export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>

/**
 * 从 Vite 环境变量读取并校验前端应用配置。
 *
 * 空值将使用项目定义的默认值；接口地址除外，其空值会在 Zod 校验阶段被保留，
 * 便于本地开发时按相对地址发起请求。
 *
 * @returns 校验通过的前端应用配置。
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
