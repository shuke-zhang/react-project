import type { MenuProps } from 'antd'
import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, TeamOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, Menu, Space, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '@/api/session'
import './MainLayout.css'

const { Header, Sider, Content } = Layout

const menuItems: MenuProps['items'] = [
  { key: '/home', icon: <HomeOutlined />, label: '工作台首页' },
  { key: '/users', icon: <TeamOutlined />, label: '用户管理' },
]

interface MainLayoutProps {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function MainLayout({ collapsed, onToggleCollapsed }: MainLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Layout className="main-layout">
      <Sider className="main-layout__sider" collapsed={collapsed} width={222} collapsedWidth={76}>
        <button className="main-layout__brand" type="button" onClick={() => navigate('/home')}>
          <span className="main-layout__brand-mark">+</span>
          {!collapsed && (
            <span className="main-layout__brand-copy">
              <strong>企业模板</strong>
              <small>REACT CONSOLE</small>
            </span>
          )}
        </button>
        <Menu
          className="main-layout__menu"
          mode="inline"
          theme="dark"
          items={menuItems}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout className="main-layout__workspace">
        <Header className="main-layout__header">
          <Space>
            <Button
              aria-label="展开或收起侧边栏"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={onToggleCollapsed}
            />
            <Typography.Text className="main-layout__title">企业级 React 项目模板</Typography.Text>
          </Space>
          <Dropdown
            menu={{
              items: [{ key: 'logout', label: '退出登录' }],
              onClick: handleLogout,
            }}
          >
            <Button className="main-layout__account" type="text">
              <Avatar style={{ background: '#35bda7' }}>管</Avatar>
              <span>管理员</span>
            </Button>
          </Dropdown>
        </Header>
        <Content className="main-layout__content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
