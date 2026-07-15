import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { ReactLearningTopicView } from '@/views/react-learning/ReactLearningTopicView'

vi.mock('@/views/react-learning/components/OnlinePlayground', () => ({
  OnlinePlayground: () => <div data-testid="在线练习区"><button type="button">恢复默认代码</button></div>,
}))

describe('React 知识点页面', () => {
  it('在 useState 独立路由中展示完整学习结构', async () => {
    render(
      <AppProviders>
        <MemoryRouter>
          <ReactLearningTopicView topicId="use-state" />
        </MemoryRouter>
      </AppProviders>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'useState' })).toBeInTheDocument()
    expect(screen.getByTestId('react-learning-page')).toHaveClass('min-w-0', 'w-full', 'max-w-full', 'overflow-x-hidden')
    for (const sectionTitle of [
      '基础用法',
      '可运行效果',
      '进阶与企业用法',
      'Vue 3 对照',
      '常见错误',
      '推荐写法',
      'TSX 源码与在线练习',
    ]) {
      expect(screen.getAllByRole('heading', { name: sectionTitle }).length).toBeGreaterThan(0)
    }
    expect(await screen.findByRole('button', { name: '恢复默认代码' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Markdown 教程' })).toBeInTheDocument()
    const runnableSection = screen.getAllByRole('heading', { name: '可运行效果' })[0].closest('section')
    expect(runnableSection).not.toBeNull()
    expect(await within(runnableSection as HTMLElement).findByTestId('在线练习区')).toBeInTheDocument()
  })

  it('根据路由显示 useEffect 的专属用法和错误边界', () => {
    render(
      <AppProviders>
        <MemoryRouter>
          <ReactLearningTopicView topicId="use-effect" />
        </MemoryRouter>
      </AppProviders>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'useEffect' })).toBeInTheDocument()
    expect(screen.getAllByText(/外部系统同步/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/用 Effect 计算派生状态/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/稳定能力。本页从最小语法/)).not.toBeInTheDocument()
  })
})
