import type { LazyExoticComponent, ReactNode } from 'react'
import { lazy } from 'react'
import { HomeOutlined, TeamOutlined } from '@ant-design/icons'
import type { RouteObject } from 'react-router-dom'

/**
 * 工作台首页路径。
 */
export const HOME_PATH = '/home'

/**
 * 工作台页面的稳定业务标识。
 */
export type WorkspacePageKey = 'home' | 'users'

/**
 * 工作台页面注册项。
 */
export interface WorkspacePage {
  key: WorkspacePageKey
  path: string
  title: string
  icon: ReactNode
  visibleInMenu: boolean
  loadView: () => LazyExoticComponent<() => ReactNode>
}

/**
 * 已打开的工作台标签页。
 */
export interface OpenedWorkspaceTab {
  path: string
  title: string
  closable: boolean
}

/**
 * 关闭工作台标签页后的导航结果。
 */
export interface CloseWorkspaceTabResult {
  openedPaths: string[]
  nextPath: string
}

/**
 * 工作台页面注册表，集中声明菜单、路由和懒加载视图。
 */
export const WORKSPACE_PAGES: WorkspacePage[] = [
  {
    key: 'home',
    path: HOME_PATH,
    title: '首页',
    icon: <HomeOutlined />,
    visibleInMenu: true,
    loadView: () => lazy(() => import('@/views/home/HomeView').then(module => ({ default: module.HomeView }))),
  },
  {
    key: 'users',
    path: '/users',
    title: '用户管理',
    icon: <TeamOutlined />,
    visibleInMenu: true,
    loadView: () => lazy(() => import('@/views/users/UsersView').then(module => ({ default: module.UsersView }))),
  },
]

const pageTitleMap = new Map(WORKSPACE_PAGES.map(page => [page.path, page.title]))

/**
 * 根据路径读取工作台页面标题。
 *
 * @param pathname 当前路由路径。
 * @returns 已注册页面标题；未知路径回退为首页标题。
 */
export function getWorkspacePageTitle(pathname: string): string {
  return pageTitleMap.get(pathname) || '首页'
}

/**
 * 判断路径是否属于已注册工作台页面。
 *
 * @param pathname 当前路由路径。
 * @returns 已注册时返回 `true`。
 */
export function isKnownWorkspacePage(pathname: string): boolean {
  return pageTitleMap.has(pathname)
}

/**
 * 构建工作台侧边菜单项。
 *
 * @returns 可直接传给 Ant Design Menu 的菜单项数组。
 */
export function getWorkspaceMenuItems() {
  return WORKSPACE_PAGES
    .filter(page => page.visibleInMenu)
    .map(page => ({
      key: page.path,
      icon: page.icon,
      label: page.title,
    }))
}

/**
 * 根据页面注册表构建工作台子路由。
 *
 * @param renderWithSuspense 用于包裹懒加载页面的渲染函数。
 * @returns React Router 路由对象数组。
 */
export function getWorkspaceRouteObjects(renderWithSuspense: (node: ReactNode) => ReactNode): RouteObject[] {
  return WORKSPACE_PAGES.map((page) => {
    const View = page.loadView()
    const path = page.path.startsWith('/') ? page.path.slice(1) : page.path

    return {
      path,
      element: renderWithSuspense(<View />),
    }
  })
}

/**
 * 打开工作台路径并维护标签页列表。
 *
 * @param openedPaths 当前已打开路径列表。
 * @param pathname 需要打开的路径。
 * @returns 更新后的已打开路径列表；未知路径会保持原列表。
 */
export function openWorkspacePath(openedPaths: string[], pathname: string): string[] {
  if (!isKnownWorkspacePage(pathname)) {
    return openedPaths
  }

  const nextPaths = openedPaths.includes(HOME_PATH) ? [...openedPaths] : [HOME_PATH, ...openedPaths]

  if (!nextPaths.includes(pathname)) {
    nextPaths.push(pathname)
  }

  return nextPaths
}

/**
 * 将已打开路径转换为标签页展示模型。
 *
 * @param openedPaths 已打开路径列表。
 * @returns 标签页展示模型列表。
 */
export function getOpenedWorkspaceTabs(openedPaths: string[]): OpenedWorkspaceTab[] {
  return openedPaths.map(path => ({
    path,
    title: getWorkspacePageTitle(path),
    closable: path !== HOME_PATH,
  }))
}

/**
 * 关闭工作台标签页并计算下一跳路径。
 *
 * @param openedPaths 当前已打开路径列表。
 * @param activePath 当前激活路径。
 * @param closingPath 需要关闭的路径。
 * @returns 关闭后的路径列表和下一跳路径。
 */
export function closeWorkspaceTab(
  openedPaths: string[],
  activePath: string,
  closingPath: string,
): CloseWorkspaceTabResult {
  if (closingPath === HOME_PATH) {
    return { openedPaths, nextPath: activePath }
  }

  const closingIndex = openedPaths.findIndex(path => path === closingPath)
  const fallbackPath = openedPaths[closingIndex - 1] || HOME_PATH
  const nextOpenedPaths = openedPaths.filter(path => path !== closingPath)
  const nextPath = activePath === closingPath ? fallbackPath : activePath

  return {
    openedPaths: nextOpenedPaths.includes(HOME_PATH) ? nextOpenedPaths : [HOME_PATH, ...nextOpenedPaths],
    nextPath,
  }
}
