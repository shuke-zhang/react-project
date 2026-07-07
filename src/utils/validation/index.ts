import type { ZodSchema } from 'zod'

/** 使用 zod 校验接口返回数据。 */
export function parseWithSchema<T>(schema: ZodSchema<T>, value: unknown): T {
  return schema.parse(value)
}
