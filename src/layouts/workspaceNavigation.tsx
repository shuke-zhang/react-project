import type { LazyExoticComponent, ReactNode } from 'react'
import { lazy } from 'react'
import { HomeOutlined, TeamOutlined } from '@ant-design/icons'
import type { RouteObject } from 'react-router-dom'

export const HOME_PATH = '/home'

export type WorkspacePageKey = 'home' | 'users'

export interface WorkspacePage {
  key: WorkspacePageKey
  path: string
  title: string
  icon: ReactNode
  visibleInMenu: boolean
  loadView: () => LazyExoticComponent<() => ReactNode>
}

export interface OpenedWorkspaceTab {
  path: string
  title: string
  closable: boolean
}

export interface CloseWorkspaceTabResult {
  openedPaths: string[]
  nextPath: string
}

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

export function getWorkspacePageTitle(pathname: string): string {
  return pageTitleMap.get(pathname) || '首页'
}

export function isKnownWorkspacePage(pathname: string): boolean {
  return pageTitleMap.has(pathname)
}

export function getWorkspaceMenuItems() {
  return WORKSPACE_PAGES
    .filter(page => page.visibleInMenu)
    .map(page => ({
      key: page.path,
      icon: page.icon,
      label: page.title,
    }))
}

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

export function getOpenedWorkspaceTabs(openedPaths: string[]): OpenedWorkspaceTab[] {
  return openedPaths.map(path => ({
    path,
    title: getWorkspacePageTitle(path),
    closable: path !== HOME_PATH,
  }))
}

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
