import type { UserModel, UserStatus } from '@/types/user'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd'
import { useState } from 'react'
import { createUser, deleteUser, getUsers, updateUser } from '@/api/users'
import {
  DEFAULT_USER_QUERY,
  USER_QUERY_KEY,
  USER_STATUS_FILTER_OPTIONS,
  USER_STATUS_OPTIONS,
  type UserFormValues,
  buildUsersQueryKey,
  toCreateUserParams,
  toUpdateUserParams,
  toUserFormValues,
} from '@/views/users/userManagement'

/**
 * 用户管理页面。
 *
 * @returns 用户查询、列表、新增、编辑和删除的管理页面节点。
 */
export function UsersView() {
  const [query, setQuery] = useState(DEFAULT_USER_QUERY)
  const [editingUser, setEditingUser] = useState<UserModel | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<UserFormValues>()
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: buildUsersQueryKey(query),
    queryFn: () => getUsers(query),
  })

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      void message.success('用户新增成功')
      setModalOpen(false)
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      void message.success('用户更新成功')
      setModalOpen(false)
      setEditingUser(null)
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      void message.success('用户删除成功')
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
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

  /** 打开新增用户弹窗并初始化表单默认值。 */
  function handleCreate() {
    setEditingUser(null)
    form.setFieldsValue(toUserFormValues())
    setModalOpen(true)
  }

  /**
   * 打开编辑用户弹窗并回填用户数据。
   *
   * @param user 需要编辑的用户。
   */
  function handleEdit(user: UserModel) {
    setEditingUser(user)
    form.setFieldsValue(toUserFormValues(user))
    setModalOpen(true)
  }

  /**
   * 提交用户表单，并根据当前弹窗状态创建或更新用户。
   *
   * @throws 当表单校验失败时抛出 Ant Design 表单校验错误。
   */
  async function handleSubmit() {
    const values = await form.validateFields()

    if (editingUser) {
      updateMutation.mutate(toUpdateUserParams(editingUser.id, values))
      return
    }

    createMutation.mutate(toCreateUserParams(values))
  }

  return (
    <main className="grid gap-4">
      <Card className="rounded-lg [&_.ant-card-body]:flex [&_.ant-card-body]:flex-wrap [&_.ant-card-body]:items-start [&_.ant-card-body]:justify-between [&_.ant-card-body]:gap-4">
        <Form layout="inline" onFinish={values => setQuery(values)} initialValues={DEFAULT_USER_QUERY}>
          <Form.Item name="keyword" label="关键词">
            <Input allowClear placeholder="账号、姓名或手机号" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              style={{ width: 130 }}
              options={[...USER_STATUS_FILTER_OPTIONS]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">查询</Button>
              <Button icon={<ReloadOutlined />} onClick={() => setQuery(DEFAULT_USER_QUERY)}>重置</Button>
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
            <Select options={[...USER_STATUS_OPTIONS]} />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  )
}
