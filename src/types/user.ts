export type UserStatus = 'enabled' | 'disabled'

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

export interface UserListQuery {
  keyword?: string
  status?: UserStatus | 'all'
}

export type CreateUserParams = Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUserParams = Partial<CreateUserParams> & { id: string }
