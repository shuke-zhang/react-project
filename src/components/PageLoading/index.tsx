import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

const loadingPreviewWidths = ['w-full', 'w-4/5', 'w-3/5'] as const

/**
 * 页面加载状态的配置。
 */
interface PageLoadingProps {
  /** 加载状态容器的样式类名；未传入时占满整个视口。 */
  className?: string
}

/**
 * 页面级加载状态组件。
 *
 * 默认按整页视口居中。嵌入工作台内容区时，可传入与布局可用高度匹配的类名，
 * 避免顶栏和标签栏造成加载指示器视觉偏移。
 *
 * @param props 页面加载状态的配置。
 * @param props.className 加载状态容器的样式类名。
 * @returns 带有无障碍状态说明的加载节点。
 */
export function PageLoading({ className = 'min-h-screen' }: PageLoadingProps) {
  return (
    <div
      className={['grid place-items-center bg-[radial-gradient(circle_at_top,#f4fbf9,transparent_42%)] px-4', className].join(' ')}
      role="status"
      aria-label="页面加载中"
    >
      <section className="w-full max-w-[360px] rounded-xl border border-[#d9ebe6] bg-white p-6 shadow-[0_16px_40px_rgb(28_79_70_/_10%)] max-[720px]:p-5" aria-label="加载状态">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-xl bg-admin-primary-soft text-admin-primary shadow-[inset_0_0_0_1px_rgb(22_139_120_/_12%)]">
            <Spin indicator={<LoadingOutlined spin className="!text-xl !leading-none motion-reduce:!animate-none" />} />
          </div>
          <div className="min-w-0">
            <p className="m-0 text-base font-semibold text-admin-text-strong">正在准备工作台</p>
            <p className="mt-1 mb-0 text-sm leading-6 text-admin-text-muted">正在加载页面资源，请稍候</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3" aria-label="加载内容预览">
          {loadingPreviewWidths.map(width => (
            <span
              className={['block h-2 rounded-full bg-admin-primary-soft motion-safe:animate-pulse motion-reduce:animate-none', width].join(' ')}
              data-testid="加载内容预览"
              key={width}
            />
          ))}
        </div>
        <p className="mb-0 mt-5 flex items-center gap-2 text-xs text-admin-text-muted">
          <span className="size-1.5 rounded-full bg-admin-primary" aria-hidden="true" />
          正在建立安全连接
        </p>
      </section>
    </div>
  )
}
