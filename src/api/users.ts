import type { CreateUserParams, UpdateUserParams, UserListQuery, UserModel } from '@/types/user'
import { createMockUsersDataAdapter } from '@/api/usersAdapter'

const usersDataAdapter = createMockUsersDataAdapter()

/** 查询用户列表。 */
export function getUsers(query: UserListQuery = {}): Promise<UserModel[]> {
  return usersDataAdapter.getUsers(query)
}

/** 查询用户详情。 */
export function getUserDetail(id: string): Promise<UserModel> {
  return usersDataAdapter.getUserDetail(id)
}

/** 新增用户。 */
export function createUser(data: CreateUserParams): Promise<UserModel> {
  return usersDataAdapter.createUser(data)
}

/** 更新用户。 */
export function updateUser(data: UpdateUserParams): Promise<UserModel> {
  return usersDataAdapter.updateUser(data)
}

/** 删除用户。 */
export function deleteUser(id: string): Promise<void> {
  return usersDataAdapter.deleteUser(id)
}

/** 重置 mock 用户数据，供测试使用。 */
export function resetMockUsers(): void {
  usersDataAdapter.reset()
}
