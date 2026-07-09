import type { CreateUserParams, UpdateUserParams, UserListQuery, UserModel, UserStatus } from '@/types/user'

/**
 * 用户表单字段值。
 */
export interface UserFormValues {
  username: string
  nickname: string
  realName: string
  phone: string
  email: string
  department: string
  roleNames: string
  status: UserStatus
}

/**
 * 用户列表默认查询条件。
 */
export const DEFAULT_USER_QUERY: UserListQuery = { status: 'all' }

/**
 * React Query 中用户列表数据的基础查询键。
 */
export const USER_QUERY_KEY = ['users'] as const

/**
 * 用户状态筛选下拉选项。
 */
export const USER_STATUS_FILTER_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '启用', value: 'enabled' },
  { label: '停用', value: 'disabled' },
] as const

/**
 * 用户表单中的用户状态选项。
 */
export const USER_STATUS_OPTIONS = [
  { label: '启用', value: 'enabled' },
  { label: '停用', value: 'disabled' },
] as const

/**
 * 构建用户列表查询键。
 *
 * @param query 用户列表筛选条件。
 * @returns 可供 React Query 使用的稳定查询键。
 */
export function buildUsersQueryKey(query: UserListQuery) {
  return [...USER_QUERY_KEY, query] as const
}

/**
 * 将用户模型转换为用户表单初始值。
 *
 * @param user 待编辑的用户；为空时返回新增用户的默认值。
 * @returns 用户表单可直接消费的字段值。
 */
export function toUserFormValues(user?: UserModel): Partial<UserFormValues> {
  if (!user) {
    return { status: 'enabled' }
  }

  return {
    ...user,
    roleNames: user.roleNames.join('、'),
  }
}

/**
 * 将用户表单值转换为新增用户参数。
 *
 * @param values 用户表单值。
 * @returns 新增用户接口所需参数。
 */
export function toCreateUserParams(values: UserFormValues): CreateUserParams {
  return {
    username: values.username,
    nickname: values.nickname,
    realName: values.realName,
    phone: values.phone,
    email: values.email,
    department: values.department,
    roleNames: values.roleNames.split(/[、,，]/).map(item => item.trim()).filter(Boolean),
    status: values.status,
  }
}

/**
 * 将用户表单值转换为更新用户参数。
 *
 * @param id 被更新的用户 ID。
 * @param values 用户表单值。
 * @returns 更新用户接口所需参数。
 */
export function toUpdateUserParams(id: string, values: UserFormValues): UpdateUserParams {
  return {
    id,
    ...toCreateUserParams(values),
  }
}
