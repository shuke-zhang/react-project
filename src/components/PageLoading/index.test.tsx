import { render, screen } from '@testing-library/react'
import { PageLoading } from '@/components/PageLoading'

describe('页面加载状态', () => {
  it('占据工作台内容区的可用视口高度，使加载指示器垂直居中', () => {
    render(<PageLoading className="min-h-[calc(100vh-144px)] max-[720px]:min-h-[calc(100vh-128px)]" />)

    expect(screen.getByRole('status', { name: '页面加载中' })).toHaveClass('min-h-[calc(100vh-144px)]')
    expect(screen.getByText('正在准备工作台')).toBeInTheDocument()
    expect(screen.getByText('正在加载页面资源，请稍候')).toBeInTheDocument()
    expect(screen.getAllByTestId('加载内容预览')).toHaveLength(3)
  })
})
