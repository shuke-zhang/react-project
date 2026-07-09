/**
 * 通用分页结果。
 *
 * @template T 分页记录项类型。
 */
export interface PageResult<T> {
  records: T[]
  total: number
}
