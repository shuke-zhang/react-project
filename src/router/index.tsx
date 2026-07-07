/* eslint-disable react/only-export-components */
import type { ReactNode } from 'react'
import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PageLoading } from '@/components/PageLoading'
import { AuthRoute } from '@/router/AuthRoute'
import { MainLayoutShell } from './MainLayoutShell'

const HomeView = lazy(() => import('@/views/home/HomeView').then(module => ({ default: module.HomeView })))
const LoginView = lazy(() => import('@/views/login/LoginView').then(module => ({ default: module.LoginView })))
const NotFoundView = lazy(() => import('@/views/not-found/NotFoundView').then(module => ({ default: module.NotFoundView })))
const UsersView = lazy(() => import('@/views/users/UsersView').then(module => ({ default: module.UsersView })))

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
      { path: 'home', element: withSuspense(<HomeView />) },
      { path: 'users', element: withSuspense(<UsersView />) },
    ],
  },
  {
    path: '*',
    element: withSuspense(<NotFoundView />),
  },
])

