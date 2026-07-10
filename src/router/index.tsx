/* eslint-disable react/only-export-components */
import type { ReactNode } from 'react'
import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PageLoading } from '@/components/PageLoading'
import { getWorkspaceRouteObjects } from '@/layouts/workspaceNavigation'
import { AuthRoute } from '@/router/AuthRoute'
import { MainLayoutShell } from './MainLayoutShell'

const LoginView = lazy(() => import('@/views/login/LoginView').then(module => ({ default: module.LoginView })))
const NotFoundView = lazy(() => import('@/views/not-found/NotFoundView').then(module => ({ default: module.NotFoundView })))

/**
 * 为懒加载页面包裹统一加载态。
 *
 * @param node 懒加载页面节点。
 * @returns 包含 Suspense 加载态的页面节点。
 */
function withSuspense(node: ReactNode) {
  return <Suspense fallback={<PageLoading />}>{node}</Suspense>
}

/**
 * 应用主路由配置。
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(<LoginView />),
  },
  {
    path: '/',
    element: (
      <AuthRoute>
        <MainLayoutShell />
      </AuthRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      ...getWorkspaceRouteObjects(withSuspense),
    ],
  },
  {
    path: '*',
          element: withSuspense(<NotFoundView />),
  },
])
