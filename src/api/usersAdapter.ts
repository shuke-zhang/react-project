import type { CreateUserParams, UpdateUserParams, UserListQuery, UserModel } from '@/types/user'
import { z } from 'zod'
import { mockUsers } from '@/mocks/users'
import { parseWithSchema } from '@/utils/validation'

/**
 * 用户数据适配器，隔离真实后端和 mock 数据源差异。
 */
export interface UsersDataAdapter {
  getUsers: (query?: UserListQuery) => Promise<UserModel[]>
  getUserDetail: (id: string) => Promise<UserModel>
  createUser: (data: CreateUserParams) => Promise<UserModel>
  updateUser: (data: UpdateUserParams) => Promise<UserModel>
  deleteUser: (id: string) => Promise<void>
}

const userStatusSchema = z.union([z.literal('enabled'), z.literal('disabled')])
const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  nickname: z.string(),
  realName: z.string(),
  phone: z.string(),
  email: z.string(),
  roleNames: z.array(z.string()),
  department: z.string(),
  status: userStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})
const userListSchema = z.array(userSchema)

/**
 * 模拟接口延迟。
 *
 * @returns 延迟完成的 Promise。
 */
function waitForMockApi(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 80))
}

/**
 * 创建用户数据更新时间文本。
 *
 * @returns ISO 格式时间字符串。
 */
function createNowText(): string {
  return new Date().toISOString()
}

/**
 * 创建基于内存数据的用户数据适配器。
 *
 * @param initialUsers 初始用户列表。
 * @returns 用户数据适配器及测试用重置方法。
 */
export function createMockUsersDataAdapter(initialUsers: UserModel[] = mockUsers): UsersDataAdapter & {
  reset: (nextUsers?: UserModel[]) => void
} {
  let users: UserModel[] = [...initialUsers]

  return {
    async getUsers(query: UserListQuery = {}) {
      await waitForMockApi()
      const keyword = query.keyword?.trim().toLowerCase()

      const result = users.filter((user) => {
        const matchedKeyword = !keyword
          || user.username.toLowerCase().includes(keyword)
          || user.nickname.toLowerCase().includes(keyword)
          || user.realName.toLowerCase().includes(keyword)
          || user.phone.includes(keyword)
        const matchedStatus = !query.status || query.status === 'all' || user.status === query.status

        return matchedKeyword && matchedStatus
      })

      return parseWithSchema(userListSchema, result)
    },

    async getUserDetail(id: string) {
      await waitForMockApi()
      const user = users.find(item => item.id === id)

      if (!user) {
        throw new Error('用户不存在')
      }

      return parseWithSchema(userSchema, user)
    },

    async createUser(data: CreateUserParams) {
      await waitForMockApi()
      const now = createNowText()
      const user: UserModel = {
        ...data,
        id: `${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      }

      users = [user, ...users]
      return parseWithSchema(userSchema, user)
    },

    async updateUser(data: UpdateUserParams) {
      await waitForMockApi()
      const target = users.find(user => user.id === data.id)

      if (!target) {
        throw new Error('用户不存在')
      }

      const nextUser: UserModel = {
        ...target,
        ...data,
        updatedAt: createNowText(),
      }

      users = users.map(user => (user.id === data.id ? nextUser : user))
      return parseWithSchema(userSchema, nextUser)
    },

    async deleteUser(id: string) {
      await waitForMockApi()
      users = users.filter(user => user.id !== id)
    },

    reset(nextUsers: UserModel[] = mockUsers) {
      users = [...nextUsers]
    },
  }
}
