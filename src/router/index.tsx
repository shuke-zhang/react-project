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

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<PageLoading />}>{node}</Suspense>
}

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
