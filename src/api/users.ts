import type { CreateUserParams, UpdateUserParams, UserListQuery, UserModel } from '@/types/user'
import { z } from 'zod'
import { mockUsers } from '@/mocks/users'
import { parseWithSchema } from '@/utils/validation'

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

let users: UserModel[] = [...mockUsers]

function waitForMockApi(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 80))
}

function createNowText(): string {
  return new Date().toISOString()
}

/** 查询用户列表。 */
export async function getUsers(query: UserListQuery = {}): Promise<UserModel[]> {
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
}

/** 查询用户详情。 */
export async function getUserDetail(id: string): Promise<UserModel> {
  await waitForMockApi()
  const user = users.find(item => item.id === id)

  if (!user) {
    throw new Error('用户不存在')
  }

  return parseWithSchema(userSchema, user)
}

/** 新增用户。 */
export async function createUser(data: CreateUserParams): Promise<UserModel> {
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
}

/** 更新用户。 */
export async function updateUser(data: UpdateUserParams): Promise<UserModel> {
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
}

/** 删除用户。 */
export async function deleteUser(id: string): Promise<void> {
  await waitForMockApi()
  users = users.filter(user => user.id !== id)
}

/** 重置 mock 用户数据，供测试使用。 */
export function resetMockUsers(nextUsers: UserModel[] = mockUsers): void {
  users = [...nextUsers]
}
