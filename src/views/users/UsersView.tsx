import type { CreateUserParams, UpdateUserParams, UserListQuery, UserModel, UserStatus } from '@/types/user'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd'
import { useState } from 'react'
import { createUser, deleteUser, getUsers, updateUser } from '@/api/users'
import './UsersView.css'

interface UserFormValues {
  username: string
  nickname: string
  realName: string
  phone: string
  email: string
  department: string
  roleNames: string
  status: UserStatus
}

function toFormValues(user?: UserModel): Partial<UserFormValues> {
  if (!user) {
    return { status: 'enabled' }
  }

  return {
    ...user,
    roleNames: user.roleNames.join('、'),
  }
}

function toCreateParams(values: UserFormValues): CreateUserParams {
  return {
    username: values.username,
    nickname: values.nickname,
    realName: values.realName,
    phone: values.phone,
    email: values.email,
    department: values.department,
    roleNames: values.roleNames.split(/[、,，]/).map(item => item.trim()).filter(Boolean),
    status: values.status,
  }
}

export function UsersView() {
  const [query, setQuery] = useState<UserListQuery>({ status: 'all' })
  const [editingUser, setEditingUser] = useState<UserModel | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<UserFormValues>()
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['users', query],
    queryFn: () => getUsers(query),
  })

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      void message.success('用户新增成功')
      setModalOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      void message.success('用户更新成功')
      setModalOpen(false)
      setEditingUser(null)
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      void message.success('用户删除成功')
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const columns = [
    { title: '账号', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'realName', key: 'realName' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    {
      title: '角色',
      dataIndex: 'roleNames',
      key: 'roleNames',
      render: (roles: string[]) => roles.map(role => <Tag key={role}>{role}</Tag>),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>{status === 'enabled' ? '启用' : '停用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, record: UserModel) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除该用户？" okText="删除" cancelText="取消" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button danger type="link">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  function handleCreate() {
    setEditingUser(null)
    form.setFieldsValue(toFormValues())
    setModalOpen(true)
  }

  function handleEdit(user: UserModel) {
    setEditingUser(user)
    form.setFieldsValue(toFormValues(user))
    setModalOpen(true)
  }

  async function handleSubmit() {
    const values = await form.validateFields()
    const params = toCreateParams(values)

    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, ...params } satisfies UpdateUserParams)
      return
    }

    createMutation.mutate(params)
  }

  return (
    <main className="users-view">
      <Card className="users-view__toolbar">
        <Form layout="inline" onFinish={values => setQuery(values)} initialValues={{ status: 'all' }}>
          <Form.Item name="keyword" label="关键词">
            <Input allowClear placeholder="账号、姓名或手机号" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              style={{ width: 130 }}
              options={[
                { label: '全部', value: 'all' },
                { label: '启用', value: 'enabled' },
                { label: '停用', value: 'disabled' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">查询</Button>
              <Button icon={<ReloadOutlined />} onClick={() => setQuery({ status: 'all' })}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <Button icon={<PlusOutlined />} type="primary" onClick={handleCreate}>新增用户</Button>
      </Card>
      <Card>
        <Table<UserModel>
          rowKey="id"
          columns={columns}
          dataSource={usersQuery.data ?? []}
          loading={usersQuery.isLoading}
          pagination={{ pageSize: 8, showTotal: total => `共 ${total} 条` }}
        />
      </Card>
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalOpen}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="保存"
        cancelText="取消"
      >
        <Form<UserFormValues> form={form} layout="vertical">
          <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
            <Input placeholder="请输入账号" />
          </Form.Item>
          <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item name="realName" label="真实姓名" rules={[{ required: true, message: '请输入真实姓名' }]}>
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确邮箱' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="department" label="部门" rules={[{ required: true, message: '请输入部门' }]}>
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item name="roleNames" label="角色" rules={[{ required: true, message: '请输入角色' }]}>
            <Input placeholder="多个角色可用顿号分隔" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={[{ label: '启用', value: 'enabled' }, { label: '停用', value: 'disabled' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  )
}

