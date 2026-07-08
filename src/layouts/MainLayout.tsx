import {
  CloseOutlined,
  DownOutlined,
  FullscreenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, Menu, Tooltip, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { logout } from '@/api/session'
import {
  HOME_PATH,
  closeWorkspaceTab,
  getOpenedWorkspaceTabs,
  getWorkspaceMenuItems,
  getWorkspacePageTitle,
  openWorkspacePath,
} from '@/layouts/workspaceNavigation'
import './MainLayout.css'

const { Header, Sider, Content } = Layout
const menuItems = getWorkspaceMenuItems()

interface MainLayoutProps {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function MainLayout({ collapsed, onToggleCollapsed }: MainLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [openedPaths, setOpenedPaths] = useState<string[]>([HOME_PATH])
  const pageTitle = getWorkspacePageTitle(location.pathname)

  const openedTabs = useMemo(
    () => getOpenedWorkspaceTabs(openedPaths),
    [openedPaths],
  )

  useEffect(() => {
    setOpenedPaths(paths => openWorkspacePath(paths, location.pathname))
  }, [location.pathname])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    await document.documentElement.requestFullscreen()
  }

  function handleTabClick(path: string) {
    navigate(path)
  }

  function closeTab(path: string) {
    const result = closeWorkspaceTab(openedPaths, location.pathname, path)
    setOpenedPaths(result.openedPaths)

    if (result.nextPath !== location.pathname) {
      navigate(result.nextPath, { replace: true })
    }
  }

  return (
    <Layout className="main-layout">
      <Sider className="main-layout__sider" collapsed={collapsed} width={222} collapsedWidth={76}>
        <button className="main-layout__brand" type="button" onClick={() => navigate(HOME_PATH)}>
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
          <div className="main-layout__heading">
            <Button
              aria-label="展开或收起侧边栏"
              className="main-layout__menu-toggle"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={onToggleCollapsed}
            />
            <Typography.Text className="main-layout__title">{pageTitle}</Typography.Text>
          </div>
          <div className="main-layout__actions">
            <Tooltip title="切换全屏">
              <Button
                aria-label="切换全屏"
                className="main-layout__icon-button"
                type="text"
                icon={<FullscreenOutlined />}
                onClick={() => void toggleFullscreen()}
              />
            </Tooltip>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [{ key: 'logout', label: '退出登录' }],
                onClick: handleLogout,
              }}
            >
              <Button className="main-layout__account" type="text">
                <Avatar className="main-layout__avatar">管</Avatar>
                <span className="main-layout__account-copy">
                  <strong>管理员</strong>
                  <small>已登录工作台</small>
                </span>
                <DownOutlined className="main-layout__account-arrow" />
              </Button>
            </Dropdown>
          </div>
        </Header>
        <nav className="main-layout__tabs" aria-label="页面标签">
          {openedTabs.map(tab => {
            const active = tab.path === location.pathname

            return (
              <div
                className={active ? 'main-layout__tab main-layout__tab--active' : 'main-layout__tab'}
                key={tab.path}
              >
                <button
                  className="main-layout__tab-link"
                  type="button"
                  onClick={() => handleTabClick(tab.path)}
                >
                  {active && <span className="main-layout__tab-dot" aria-hidden="true" />}
                  {tab.title}
                </button>
                {tab.closable && (
                  <button
                    aria-label={`关闭${tab.title}标签`}
                    className="main-layout__tab-close"
                    type="button"
                    onClick={() => closeTab(tab.path)}
                  >
                    <CloseOutlined />
                  </button>
                )}
              </div>
            )
          })}
        </nav>
        <Content className="main-layout__content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
