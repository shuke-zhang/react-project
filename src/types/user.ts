/**
 * 用户状态，表示用户是否可以正常使用系统。
 */
export type UserStatus = 'enabled' | 'disabled'

/**
 * 后台系统中的用户模型。
 */
export interface UserModel {
  id: string
  username: string
  nickname: string
  realName: string
  phone: string
  email: string
  roleNames: string[]
  department: string
  status: UserStatus
  createdAt: string
  updatedAt: string
}

/**
 * 用户列表查询条件。
 */
export interface UserListQuery {
  keyword?: string
  status?: UserStatus | 'all'
}

/**
 * 创建用户所需参数。
 */
export type CreateUserParams = Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>

/**
 * 更新用户所需参数。
 */
export type UpdateUserParams = Partial<CreateUserParams> & { id: string }
