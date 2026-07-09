import type { ZodSchema } from 'zod'

/**
 * 使用 zod 校验未知数据。
 *
 * @param schema zod 校验 schema。
 * @param value 需要校验的未知数据。
 * @returns 校验通过后的类型化数据。
 * @throws 当数据结构不符合 schema 时抛出 zod 校验错误。
 */
export function parseWithSchema<T>(schema: ZodSchema<T>, value: unknown): T {
  return schema.parse(value)
}
