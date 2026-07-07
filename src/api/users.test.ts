import { beforeEach, describe, expect, it } from 'vitest'
import { createUser, deleteUser, getUsers, resetMockUsers, updateUser } from '@/api/users'

describe('用户服务', () => {
  beforeEach(() => {
    resetMockUsers()
  })

  it('可以查询用户列表并按关键词筛选', async () => {
    const users = await getUsers({ keyword: 'admin' })

    expect(users).toHaveLength(1)
    expect(users[0].username).toBe('admin')
  })

  it('新增用户后可以在列表中查询到', async () => {
    await createUser({
      username: 'tester',
      nickname: '测试用户',
      realName: '赵敏',
      phone: '13800000009',
      email: 'tester@example.com',
      roleNames: ['测试人员'],
      department: '质量保障部',
      status: 'enabled',
    })

    const users = await getUsers({ keyword: 'tester' })

    expect(users).toHaveLength(1)
    expect(users[0].realName).toBe('赵敏')
  })

  it('更新用户后返回新的用户信息', async () => {
    const user = await updateUser({ id: '1001', realName: '张三' })

    expect(user.realName).toBe('张三')
  })

  it('删除用户后列表不再返回该用户', async () => {
    await deleteUser('1001')

    const users = await getUsers({ keyword: 'admin' })

    expect(users).toHaveLength(0)
  })
})
