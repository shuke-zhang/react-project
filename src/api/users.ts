import type { CreateUserParams, UpdateUserParams, UserListQuery, UserModel } from '@/types/user'
import { createMockUsersDataAdapter } from '@/api/usersAdapter'

const usersDataAdapter = createMockUsersDataAdapter()

/**
 * 查询用户列表。
 *
 * @param query 用户列表查询条件。
 * @returns 符合条件的用户列表。
 */
export function getUsers(query: UserListQuery = {}): Promise<UserModel[]> {
  return usersDataAdapter.getUsers(query)
}

/**
 * 查询用户详情。
 *
 * @param id 用户 ID。
 * @returns 用户详情。
 * @throws 当用户不存在时抛出错误。
 */
export function getUserDetail(id: string): Promise<UserModel> {
  return usersDataAdapter.getUserDetail(id)
}

/**
 * 新增用户。
 *
 * @param data 新增用户参数。
 * @returns 创建后的用户。
 */
export function createUser(data: CreateUserParams): Promise<UserModel> {
  return usersDataAdapter.createUser(data)
}

/**
 * 更新用户。
 *
 * @param data 更新用户参数。
 * @returns 更新后的用户。
 * @throws 当用户不存在时抛出错误。
 */
export function updateUser(data: UpdateUserParams): Promise<UserModel> {
  return usersDataAdapter.updateUser(data)
}

/**
 * 删除用户。
 *
 * @param id 用户 ID。
 */
export function deleteUser(id: string): Promise<void> {
  return usersDataAdapter.deleteUser(id)
}

/**
 * 重置 mock 用户数据。
 *
 * @remarks 仅供测试和本地演示使用，避免不同测试之间共享用户数据状态。
 */
export function resetMockUsers(): void {
  usersDataAdapter.reset()
}
