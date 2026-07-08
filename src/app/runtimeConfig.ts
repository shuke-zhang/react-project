import { z } from 'zod'

const runtimeConfigSchema = z.object({
  apiBaseURL: z.string(),
  requestTimeoutMs: z.number().int().positive(),
  bladeTenantId: z.string().min(1),
  bladeClientId: z.string().min(1),
  bladeClientSecret: z.string().min(1),
})

export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>

function readRuntimeConfig(): RuntimeConfig {
  return runtimeConfigSchema.parse({
    apiBaseURL: import.meta.env.VITE_API_URL || '',
    requestTimeoutMs: Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS || 20 * 1000),
    bladeTenantId: import.meta.env.VITE_BLADE_TENANT_ID || '000000',
    bladeClientId: import.meta.env.VITE_BLADE_CLIENT_ID || 'saber',
    bladeClientSecret: import.meta.env.VITE_BLADE_CLIENT_SECRET || 'saber_secret',
  })
}

export const runtimeConfig = readRuntimeConfig()
