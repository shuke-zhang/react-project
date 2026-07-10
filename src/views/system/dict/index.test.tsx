import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { SYSTEM_DICT_PATH } from '@/layouts/workspaceNavigation'
import { SystemDictView } from '@/views/system/dict'

describe('系统字典页面', () => {
  it('以标准业务页呈现页头、面包屑和占位内容', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={[SYSTEM_DICT_PATH]}>
          <SystemDictView />
        </MemoryRouter>
      </AppProviders>,
    )

    expect(screen.getByRole('heading', { level: 1, name: '字典管理' })).toBeInTheDocument()
    expect(screen.getByText('系统管理')).toBeInTheDocument()
    expect(screen.getByText('系统字典功能将在此处扩展。')).toBeInTheDocument()
  })
})
