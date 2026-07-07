import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProviders } from '@/app/AppProviders'
import { AuthRoute } from '@/router/AuthRoute'
import { HomeView } from '@/views/home/HomeView'
import { LoginView } from '@/views/login/LoginView'
import { UsersView } from '@/views/users/UsersView'
import { resetMockUsers } from '@/api/users'
import { clearAuthCache, setCacheToken } from '@/utils/cache'

vi.mock('@/api/session', async () => {
  const cache = await vi.importActual<typeof import('@/utils/cache')>('@/utils/cache')

  return {
    isAuthenticated: () => Boolean(cache.getCacheToken()),
    login: async () => {
      cache.setCacheToken('mock-token')
      cache.setCacheRefreshToken('mock-refresh-token')
      cache.setCacheTenantId('000000')
      return { access_token: 'mock-token', refresh_token: 'mock-refresh-token', tenant_id: '000000' }
    },
    logout: () => cache.clearAuthCache(),
  }
})

function renderWithRouter(initialPath: string) {
  const router = createMemoryRouter([
    { path: '/login', element: <LoginView /> },
    { path: '/', element: <AuthRoute><HomeView /></AuthRoute> },
    { path: '/home', element: <AuthRoute><HomeView /></AuthRoute> },
    { path: '/users', element: <AuthRoute><UsersView /></AuthRoute> },
  ], { initialEntries: [initialPath] })

  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

describe('页面行为', () => {
  beforeEach(() => {
    localStorage.clear()
    clearAuthCache()
    resetMockUsers()
  })

  it('未登录访问业务页面时跳转到登录页', async () => {
    renderWithRouter('/users')

    expect(await screen.findByText('工作台登录')).toBeInTheDocument()
  })

  it('登录成功后进入首页', async () => {
    const user = userEvent.setup()
    renderWithRouter('/login')

    await user.click(screen.getByRole('button', { name: /登\s*录/ }))

    expect(await screen.findByText('企业级 React 项目模板')).toBeInTheDocument()
  })

  it('用户管理支持新增用户', async () => {
    const user = userEvent.setup()
    setCacheToken('mock-token')
    renderWithRouter('/users')

    await user.click(await screen.findByRole('button', { name: /新增\s*用户/ }))
    await user.type(screen.getByLabelText('账号'), 'new-user')
    await user.type(screen.getByLabelText('昵称'), '新用户')
    await user.type(screen.getByLabelText('真实姓名'), '周宁')
    await user.type(screen.getByLabelText('手机号'), '13800000010')
    await user.type(screen.getByLabelText('邮箱'), 'new-user@example.com')
    await user.type(screen.getByLabelText('部门'), '产品研发部')
    await user.type(screen.getByLabelText('角色'), '研发人员')
    await user.click(screen.getByRole('button', { name: /保\s*存/ }))

    expect(await screen.findByText('周宁')).toBeInTheDocument()
  })
})

