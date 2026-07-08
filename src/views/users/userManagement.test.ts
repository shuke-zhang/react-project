import { describe, expect, it } from 'vitest'
import type { UserModel } from '@/types/user'
import { buildUsersQueryKey, toCreateUserParams, toUpdateUserParams, toUserFormValues } from '@/views/users/userManagement'

const user: UserModel = {
  id: '1001',
  username: 'admin',
  nickname: '系统管理员',
  realName: '张明',
  phone: '13800000001',
  email: 'admin@example.com',
  roleNames: ['超级管理员', '审计人员'],
  department: '平台管理部',
  status: 'enabled',
  createdAt: '2026-07-01T09:00:00.000Z',
  updatedAt: '2026-07-02T10:00:00.000Z',
}

describe('用户管理 module', () => {
  it('把用户转换成表单值', () => {
    expect(toUserFormValues(user)).toMatchObject({
      username: 'admin',
      roleNames: '超级管理员、审计人员',
      status: 'enabled',
    })
  })

  it('把表单值转换成创建参数，并清理角色分隔符', () => {
    const params = toCreateUserParams({
      username: 'tester',
      nickname: '测试用户',
      realName: '赵敏',
      phone: '13800000009',
      email: 'tester@example.com',
      department: '质量保障部',
      roleNames: '测试人员、 审计人员,管理员，，',
      status: 'enabled',
    })

    expect(params.roleNames).toEqual(['测试人员', '审计人员', '管理员'])
  })

  it('把编辑中的用户 ID 合并到更新参数', () => {
    const params = toUpdateUserParams('1001', {
      username: 'admin',
      nickname: '系统管理员',
      realName: '张三',
      phone: '13800000001',
      email: 'admin@example.com',
      department: '平台管理部',
      roleNames: '超级管理员',
      status: 'disabled',
    })

    expect(params).toMatchObject({ id: '1001', realName: '张三', status: 'disabled' })
  })

  it('构建稳定的用户列表 query key', () => {
    expect(buildUsersQueryKey({ keyword: 'admin', status: 'enabled' })).toEqual([
      'users',
      { keyword: 'admin', status: 'enabled' },
    ])
  })
})
