import type { UserModel } from '@/types/user'

/**
 * 本地演示和测试使用的 mock 用户列表。
 */
export const mockUsers: UserModel[] = [
  {
    id: '1001',
    username: 'admin',
    nickname: '系统管理员',
    realName: '张明',
    phone: '13800000001',
    email: 'admin@example.com',
    roleNames: ['超级管理员'],
    department: '平台管理部',
    status: 'enabled',
    createdAt: '2026-07-01T09:00:00.000Z',
    updatedAt: '2026-07-02T10:00:00.000Z',
  },
  {
    id: '1002',
    username: 'operator',
    nickname: '运营同学',
    realName: '李娜',
    phone: '13800000002',
    email: 'operator@example.com',
    roleNames: ['运营人员'],
    department: '业务运营部',
    status: 'enabled',
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-02T11:00:00.000Z',
  },
  {
    id: '1003',
    username: 'auditor',
    nickname: '审计账号',
    realName: '王强',
    phone: '13800000003',
    email: 'auditor@example.com',
    roleNames: ['审计人员'],
    department: '风控合规部',
    status: 'disabled',
    createdAt: '2026-07-01T11:00:00.000Z',
    updatedAt: '2026-07-02T12:00:00.000Z',
  },
]
