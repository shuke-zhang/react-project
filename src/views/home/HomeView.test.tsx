import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { HOME_PATH } from '@/layouts/workspaceNavigation'
import { HomeView } from '@/views/home/HomeView'

describe('工作台首页', () => {
  it('保留首页内容且不渲染标准页头', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={[HOME_PATH]}>
          <HomeView />
        </MemoryRouter>
      </AppProviders>,
    )

    expect(screen.getByRole('heading', { level: 1, name: '企业级 React 项目模板' })).toBeInTheDocument()
    expect(screen.getByText('基础页面')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: '首页' })).not.toBeInTheDocument()
  })
})
