import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { MainLayout } from '@/layouts/MainLayout'

describe('后台工作台主布局', () => {
  it('在全局工具栏保留应用操作且不重复显示业务页面标题', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/users']}>
          <Routes>
            <Route element={<MainLayout collapsed={false} onToggleCollapsed={() => undefined} />}>
              <Route path="/users" element={<p>用户管理页面内容</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AppProviders>,
    )

    const toolbar = screen.getByRole('banner', { name: '全局工具栏' })

    expect(within(toolbar).getByRole('button', { name: '展开或收起侧边栏' })).toBeInTheDocument()
    expect(within(toolbar).getByRole('button', { name: '切换全屏' })).toHaveClass(
      '!inline-flex',
      '!items-center',
      '!justify-center',
      '!leading-none',
    )
    expect(within(toolbar).queryByText('用户管理')).not.toBeInTheDocument()
  })

  it('通过移动端导航抽屉切换页面并在选择后关闭抽屉', async () => {
    const user = userEvent.setup()

    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/home']}>
          <Routes>
            <Route element={<MainLayout collapsed={false} onToggleCollapsed={() => undefined} />}>
              <Route path="/home" element={<p>首页页面内容</p>} />
              <Route path="/users" element={<p>用户页面内容</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AppProviders>,
    )

    await user.click(screen.getByRole('button', { name: '打开导航菜单' }))

    const drawer = await screen.findByRole('dialog', { name: '工作台导航' })

    await user.click(within(drawer).getByRole('menuitem', { name: /用户管理/ }))

    expect(await screen.findByText('用户页面内容')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '工作台导航' })).not.toBeInTheDocument()
    })
  })
})
