import { describe, expect, it } from 'vitest'
import { mockUsers } from '@/mocks/users'
import { createMockUsersDataAdapter } from '@/api/usersAdapter'

describe('用户数据 adapter', () => {
  it('mock adapter 可以独立维护用户数据', async () => {
    const adapter = createMockUsersDataAdapter([mockUsers[0]])

    await adapter.createUser({
      username: 'tester',
      nickname: '测试用户',
      realName: '赵敏',
      phone: '13800000009',
      email: 'tester@example.com',
      roleNames: ['测试人员'],
      department: '质量保障部',
      status: 'enabled',
    })

    expect(await adapter.getUsers({ keyword: 'tester' })).toHaveLength(1)

    adapter.reset([mockUsers[0]])

    expect(await adapter.getUsers({ keyword: 'tester' })).toHaveLength(0)
  })
})
