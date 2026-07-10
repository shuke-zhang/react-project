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

const { Header, Sider, Content } = Layout
const menuItems = getWorkspaceMenuItems()

const siderClassName = [
  'bg-admin-sider shadow-[4px_0_18px_rgb(24_39_56_/_12%)] max-[720px]:!w-full max-[720px]:!min-w-full max-[720px]:!max-w-full',
  '[&_.ant-layout-sider-children]:flex [&_.ant-layout-sider-children]:flex-col [&_.ant-layout-sider-children]:!bg-admin-sider',
].join(' ')

const menuClassName = [
  'flex-1 !border-e-0 !bg-admin-sider px-2 py-2.5',
  '[&.ant-menu-dark]:!bg-transparent [&_.ant-menu-sub]:!bg-transparent [&_.ant-menu-sub]:!text-[#d8e4f0]',
  '[&_.ant-menu-item]:!mx-0 [&_.ant-menu-item]:!my-[3px] [&_.ant-menu-item]:!h-11 [&_.ant-menu-item]:!w-auto [&_.ant-menu-item]:!rounded-lg [&_.ant-menu-item]:!text-[15px] [&_.ant-menu-item]:!text-[#d8e4f0] [&_.ant-menu-item]:!leading-11',
  '[&_.ant-menu-submenu-title]:!mx-0 [&_.ant-menu-submenu-title]:!my-[3px] [&_.ant-menu-submenu-title]:!h-11 [&_.ant-menu-submenu-title]:!w-auto [&_.ant-menu-submenu-title]:!rounded-lg [&_.ant-menu-submenu-title]:!text-[15px] [&_.ant-menu-submenu-title]:!text-[#d8e4f0] [&_.ant-menu-submenu-title]:!leading-11',
  '[&_.ant-menu-item_.anticon]:!text-base [&_.ant-menu-item_.anticon]:!text-[#a9bbcc] [&_.ant-menu-submenu-title_.anticon]:!text-base [&_.ant-menu-submenu-title_.anticon]:!text-[#a9bbcc]',
  '[&_.ant-menu-item:hover]:!bg-white/8 [&_.ant-menu-item:hover]:!text-white [&_.ant-menu-item:hover_.anticon]:!text-[#67dccd] [&_.ant-menu-submenu-title:hover]:!bg-white/8 [&_.ant-menu-submenu-title:hover]:!text-white [&_.ant-menu-submenu-title:hover_.anticon]:!text-[#67dccd]',
  '[&_.ant-menu-submenu-open>.ant-menu-submenu-title]:!bg-white/6 [&_.ant-menu-submenu-open>.ant-menu-submenu-title]:!text-white [&_.ant-menu-submenu-open>.ant-menu-submenu-title_.anticon]:!text-[#67dccd] [&_.ant-menu-submenu-open>.ant-menu-submenu-title_.ant-menu-submenu-arrow]:!text-[#67dccd]',
  '[&_.ant-menu-item-selected]:!bg-[linear-gradient(90deg,#126f83,#169b93)] [&_.ant-menu-item-selected]:!text-white [&_.ant-menu-item-selected]:shadow-[inset_3px_0_#54e1d0,0_8px_16px_rgb(10_111_131_/_20%)] [&_.ant-menu-item-selected_.anticon]:!text-white',
  '[&_.ant-menu-item:focus-visible]:!outline-2 [&_.ant-menu-item:focus-visible]:!outline-offset-2 [&_.ant-menu-item:focus-visible]:!outline-[#54e1d0] [&_.ant-menu-submenu-title:focus-visible]:!outline-2 [&_.ant-menu-submenu-title:focus-visible]:!outline-offset-2 [&_.ant-menu-submenu-title:focus-visible]:!outline-[#54e1d0]',
  '[&_.ant-menu-submenu_.ant-menu]:relative [&_.ant-menu-submenu_.ant-menu]:!mb-2 [&_.ant-menu-submenu_.ant-menu]:!ml-5 [&_.ant-menu-submenu_.ant-menu]:!mt-0.5 [&_.ant-menu-submenu_.ant-menu]:!py-0 [&_.ant-menu-submenu_.ant-menu]:!pl-2.5',
  '[&_.ant-menu-submenu_.ant-menu]:before:absolute [&_.ant-menu-submenu_.ant-menu]:before:bottom-1.5 [&_.ant-menu-submenu_.ant-menu]:before:left-0 [&_.ant-menu-submenu_.ant-menu]:before:top-1.5 [&_.ant-menu-submenu_.ant-menu]:before:w-px [&_.ant-menu-submenu_.ant-menu]:before:bg-[rgb(177_200_222_/_22%)] [&_.ant-menu-submenu_.ant-menu]:before:content-[""]',
  '[&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:!h-10 [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:!my-[3px] [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:!pl-4 [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:!text-sm [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:!leading-10',
  '[&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:before:absolute [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:before:left-0.5 [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:before:top-1/2 [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:before:h-px [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:before:w-[7px] [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:before:bg-[rgb(177_200_222_/_28%)] [&_.ant-menu-submenu_.ant-menu_.ant-menu-item]:before:content-[""]',
  '[&_.ant-menu-submenu_.ant-menu_.ant-menu-item-selected]:!bg-[rgb(36_179_163_/_18%)] [&_.ant-menu-submenu_.ant-menu_.ant-menu-item-selected]:!shadow-[inset_3px_0_#54e1d0]',
].join(' ')

interface MainLayoutProps {
  collapsed: boolean
  onToggleCollapsed: () => void
}

/**
 * 后台工作台主布局。
 *
 * @param props 布局折叠状态和折叠切换回调。
 * @returns 包含侧边菜单、顶部栏、标签页和内容出口的布局节点。
 */
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

  /** 退出当前登录会话并返回登录页。 */
  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  /**
   * 切换浏览器全屏状态。
   *
   * @returns 全屏状态切换完成后的 Promise。
   */
  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    await document.documentElement.requestFullscreen()
  }

  /**
   * 切换到指定工作台标签页。
   *
   * @param path 标签页路径。
   */
  function handleTabClick(path: string) {
    navigate(path)
  }

  /**
   * 关闭指定工作台标签页，并在必要时跳转到兜底标签页。
   *
   * @param path 需要关闭的标签页路径。
   */
  function closeTab(path: string) {
    const result = closeWorkspaceTab(openedPaths, location.pathname, path)
    setOpenedPaths(result.openedPaths)

    if (result.nextPath !== location.pathname) {
      navigate(result.nextPath, { replace: true })
    }
  }

  return (
    <Layout className="min-h-screen bg-admin-page text-admin-text max-[720px]:block">
      <Sider className={siderClassName} collapsed={collapsed} width={222} collapsedWidth={76}>
        <button
          className={[
            'flex h-[72px] w-full items-center gap-[11px] border-0 bg-admin-sider-strong px-[18px] text-left text-white transition hover:bg-[#263b51] hover:shadow-[inset_3px_0_#34c7b4] focus-visible:bg-[#263b51] focus-visible:shadow-[inset_3px_0_#34c7b4] focus-visible:outline-0 max-[720px]:h-[58px]',
            collapsed ? 'justify-center px-0' : '',
          ].join(' ')}
          type="button"
          onClick={() => navigate(HOME_PATH)}
        >
          <span className="grid size-9 flex-none place-items-center rounded-lg bg-[linear-gradient(135deg,#3fd1bd,#25a994)] text-2xl font-semibold leading-none shadow-[0_8px_18px_rgb(37_169_148_/_28%)]">+</span>
          {!collapsed && (
            <span>
              <strong className="block text-base font-bold tracking-normal">企业模板</strong>
              <small className="mt-1 block text-[10px] tracking-[0.08em] text-[#9eb1c6]">REACT CONSOLE</small>
            </span>
          )}
        </button>
        <Menu
          className={[
            menuClassName,
            collapsed
              ? 'px-2.5 [&_.ant-menu-item]:!mx-auto [&_.ant-menu-item]:!grid [&_.ant-menu-item]:!w-12 [&_.ant-menu-item]:!place-items-center [&_.ant-menu-item]:!px-0 [&_.ant-menu-item-selected]:!shadow-[0_8px_16px_rgb(10_111_131_/_22%)] [&_.ant-menu-submenu-title]:!mx-auto [&_.ant-menu-submenu-title]:!grid [&_.ant-menu-submenu-title]:!w-12 [&_.ant-menu-submenu-title]:!place-items-center [&_.ant-menu-submenu-title]:!px-0'
              : '',
          ].join(' ')}
          defaultOpenKeys={['system-management']}
          mode="inline"
          theme="dark"
          items={menuItems}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout className="min-w-0">
        <Header className="flex h-14 items-center justify-between border-b border-[#e6e9ed] bg-white py-0 pl-[18px] pr-6 shadow-[0_1px_5px_rgb(32_50_68_/_5%)] max-[720px]:px-3">
          <div className="flex items-center gap-[18px] max-[720px]:gap-2">
            <Button
              aria-label="展开或收起侧边栏"
              className="grid size-[34px] place-items-center text-[#3f4958] hover:!bg-[#f0f5f4] hover:!text-[#269d88] max-[720px]:hidden"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={onToggleCollapsed}
            />
            <Typography.Text className="text-base font-medium text-admin-text-strong">{pageTitle}</Typography.Text>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip title="切换全屏">
              <Button
                aria-label="切换全屏"
                className="grid size-[34px] place-items-center text-[#3f4958] hover:!bg-[#f0f5f4] hover:!text-[#269d88]"
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
              <Button className="inline-flex h-[46px] items-center gap-2.5 px-1.5 py-1 text-[#3f4958] [&_.ant-btn-icon]:hidden" type="text">
                <Avatar className="grid !size-[42px] place-items-center !bg-[#43c7c5] text-lg">管</Avatar>
                <span className="grid gap-0.5 text-left leading-[1.2] max-[720px]:hidden">
                  <strong className="text-[13px] font-bold text-admin-text-strong">管理员</strong>
                  <small className="text-[10px] text-[#8b98aa]">已登录工作台</small>
                </span>
                <DownOutlined className="text-[10px] text-[#7f8ca3] max-[720px]:hidden" />
              </Button>
            </Dropdown>
          </div>
        </Header>
        <nav className="flex min-h-11 items-center gap-[5px] overflow-x-auto border-b border-[#dfe5ec] bg-white px-5 py-[5px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[720px]:px-2.5" aria-label="页面标签">
          {openedTabs.map(tab => {
            const active = tab.path === location.pathname

            return (
              <div
                className={[
                  'group inline-flex min-h-8 flex-none items-center border text-[13px] transition hover:-translate-y-px',
                  active
                    ? 'border-admin-primary bg-admin-primary text-white'
                    : 'border-[#d9dfe6] bg-white text-admin-text-strong hover:border-[#3cbc9f] hover:bg-admin-primary-soft hover:text-admin-primary-hover hover:shadow-[inset_0_-2px_#3cbc9f]',
                ].join(' ')}
                key={tab.path}
              >
                <button
                  className="inline-flex min-h-[30px] cursor-pointer items-center gap-[7px] border-0 bg-transparent px-3 text-inherit"
                  type="button"
                  onClick={() => handleTabClick(tab.path)}
                >
                  {active && <span className="size-2 rounded-full bg-white" aria-hidden="true" />}
                  {tab.title}
                </button>
                {tab.closable && (
                  <button
                    aria-label={`关闭${tab.title}标签`}
                    className={[
                      'mr-1.5 inline-grid size-[18px] flex-none cursor-pointer place-items-center rounded-full border-0 bg-[#e65c68] p-0 text-[10px] leading-none text-white transition hover:scale-[1.08] hover:bg-[#cf3f4d] hover:shadow-[0_2px_5px_rgb(207_63_77_/_35%)]',
                      active ? 'scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0 group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100',
                    ].join(' ')}
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
        <Content className="min-h-[calc(100vh-100px)] overflow-auto p-[22px] max-[720px]:p-3.5">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
