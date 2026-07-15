import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { BookOutlined, BulbOutlined, CodeOutlined, ExperimentOutlined, SafetyCertificateOutlined, SwapOutlined, WarningOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import topicPlaygroundCss from '@/views/react-learning/topicPlayground.css?raw'
import { BasicContainer } from '@/components/BasicContainer'
import { REACT_LEARNING_TOPICS } from '@/views/react-learning/data/topicCatalog'
import { getReactLearningTopicGuide } from '@/views/react-learning/data/topicGuides'

interface TopicSectionProps {
  title: string
  icon: ReactNode
  children: ReactNode
}

interface ReactLearningTopicViewProps {
  topicId: string
}

const CATEGORY_LABELS = {
  foundation: '基础能力',
  hook: 'React Hook',
  api: '组件与 API',
  enterprise: '企业工程',
} as const

const MarkdownViewer = lazy(() => import('@/views/react-learning/components/MarkdownViewer').then(module => ({ default: module.MarkdownViewer })))
const OnlinePlayground = lazy(() => import('@/views/react-learning/components/OnlinePlayground').then(module => ({ default: module.OnlinePlayground })))

/**
 * 为重型教程子模块提供不引发布局跳动的加载占位。
 *
 * @returns 可被屏幕阅读器识别的加载状态。
 */
function TopicModuleLoading() {
  return (
    <div className="min-h-32 animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-5 motion-reduce:animate-none" role="status">
      <span className="sr-only">正在加载学习内容</span>
      <div className="h-4 w-40 rounded bg-slate-200" />
      <div className="mt-4 h-3 w-full rounded bg-slate-200" />
      <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />
    </div>
  )
}

/**
 * 渲染一个具有统一标题层级的知识点内容区块。
 *
 * @param props 区块标题、图标和正文。
 * @returns 文档式内容区块。
 */
function TopicSection({ title, icon, children }: TopicSectionProps) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgb(15_23_42_/_4%)] sm:p-6">
      <h2 className="mb-4 mt-0 flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
        <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-700">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

/**
 * 渲染知识点列表，并保持适合长文档扫描的紧凑节奏。
 *
 * @param items 知识点说明列表。
 * @returns 格式化后的说明列表。
 */
function TopicPointList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 grid min-w-0 gap-3 break-words pl-5 text-[15px] leading-7 text-slate-700">
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  )
}

/**
 * React 独立知识点学习页面。
 *
 * @param props 知识点稳定标识。
 * @returns 包含基础、进阶、对照、示例、源码和教程的完整页面。
 * @throws 当路由引用未注册知识点时抛出错误。
 */
export function ReactLearningTopicView({ topicId }: ReactLearningTopicViewProps) {
  const topic = REACT_LEARNING_TOPICS.find(item => item.id === topicId)

  if (!topic)
    throw new Error(`未找到 React 知识点：${topicId}`)

  const guide = getReactLearningTopicGuide(topicId)

  return (
    <BasicContainer className="overflow-x-hidden rounded-xl bg-slate-50">
      <article
        className="mx-auto grid w-full min-w-0 max-w-full gap-4 overflow-x-hidden pb-8 xl:max-w-[1180px]"
        aria-labelledby="react-topic-title"
        data-testid="react-learning-page"
      >
        <header className="min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-6 shadow-[0_8px_30px_rgb(15_23_42_/_5%)] sm:px-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Tag color="blue">{CATEGORY_LABELS[topic.category]}</Tag>
            <code className="max-w-full break-all rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{topic.path}</code>
          </div>
          <h1 id="react-topic-title" className="m-0 font-mono text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{topic.title}</h1>
          <p className="mb-0 mt-3 max-w-[75ch] text-base leading-7 text-slate-600">{guide.summary}</p>
        </header>

        <div className="grid min-w-0 max-w-full gap-4 xl:grid-cols-2">
          <TopicSection title="基础用法" icon={<BulbOutlined />}><TopicPointList items={guide.basic} /></TopicSection>
          <TopicSection title="进阶与企业用法" icon={<SafetyCertificateOutlined />}><TopicPointList items={guide.advanced} /></TopicSection>
        </div>

        <TopicSection title="可运行效果" icon={<ExperimentOutlined />}>
          <p className="mb-4 mt-0 max-w-[75ch] text-[15px] leading-7 text-slate-600">
            右侧预览由下方同一份 TSX 实时编译生成。修改代码后可立即观察结果，编译与运行错误会显示在控制台。
          </p>
          <h3 className="mb-3 mt-0 flex items-center gap-2 text-base font-bold text-slate-900">
            <CodeOutlined aria-hidden="true" className="text-blue-700" />
            TSX 源码与在线练习
          </h3>
          <Suspense fallback={<TopicModuleLoading />}>
            <OnlinePlayground source={guide.source} cssSource={topicPlaygroundCss} dependencies={guide.dependencies} />
          </Suspense>
        </TopicSection>

        <div className="grid min-w-0 max-w-full gap-4 xl:grid-cols-2">
          <TopicSection title="Vue 3 对照" icon={<SwapOutlined />}><TopicPointList items={guide.vue} /></TopicSection>
          <TopicSection title="常见错误" icon={<WarningOutlined />}><TopicPointList items={guide.mistakes} /></TopicSection>
        </div>

        <TopicSection title="推荐写法" icon={<SafetyCertificateOutlined />}><TopicPointList items={guide.recommendations} /></TopicSection>

        <TopicSection title="Markdown 教程" icon={<BookOutlined />}>
          <Suspense fallback={<TopicModuleLoading />}>
            <MarkdownViewer content={guide.tutorial} />
          </Suspense>
        </TopicSection>
      </article>
    </BasicContainer>
  )
}
