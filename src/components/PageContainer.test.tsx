import { Button } from 'antd'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { PageContainer } from '@/components/PageContainer'
import { SYSTEM_DICT_PATH } from '@/layouts/workspaceNavigation'

describe('页面容器', () => {
  it('展示当前标准业务页的页头、面包屑和操作区', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={[SYSTEM_DICT_PATH]}>
          <PageContainer extra={<Button>新增字典</Button>}>
            <p>字典管理占位内容</p>
          </PageContainer>
        </MemoryRouter>
      </AppProviders>,
    )

    expect(screen.getByRole('heading', { level: 1, name: '字典管理' })).toBeInTheDocument()
    expect(screen.getByText('系统管理')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新增字典' })).toBeInTheDocument()
    expect(screen.getByText('字典管理占位内容')).toBeInTheDocument()
  })
})
