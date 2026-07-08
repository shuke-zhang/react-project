import type { CreateUserParams, UpdateUserParams, UserListQuery, UserModel, UserStatus } from '@/types/user'

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

export const DEFAULT_USER_QUERY: UserListQuery = { status: 'all' }

export const USER_QUERY_KEY = ['users'] as const

export const USER_STATUS_FILTER_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '启用', value: 'enabled' },
  { label: '停用', value: 'disabled' },
] as const

export const USER_STATUS_OPTIONS = [
  { label: '启用', value: 'enabled' },
  { label: '停用', value: 'disabled' },
] as const

export function buildUsersQueryKey(query: UserListQuery) {
  return [...USER_QUERY_KEY, query] as const
}

export function toUserFormValues(user?: UserModel): Partial<UserFormValues> {
  if (!user) {
    return { status: 'enabled' }
  }

  return {
    ...user,
    roleNames: user.roleNames.join('、'),
  }
}

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

export function toUpdateUserParams(id: string, values: UserFormValues): UpdateUserParams {
  return {
    id,
    ...toCreateUserParams(values),
  }
}
