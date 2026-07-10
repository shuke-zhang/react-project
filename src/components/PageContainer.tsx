import type { PropsWithChildren, ReactNode } from 'react'
import { Breadcrumb, Typography } from 'antd'
import { useLocation } from 'react-router-dom'
import { getWorkspacePageMetadata } from '@/layouts/workspaceNavigation'

/**
 * 页面容器属性。
 */
interface PageContainerProps extends PropsWithChildren {
  /** 页面级操作区内容，由业务页面在运行时提供。 */
  extra?: ReactNode
}

/**
 * 根据当前工作台页面元数据渲染统一页头和内容区域。
 *
 * @param props 页面内容和可选的页面级操作区。
 * @returns 包含标准业务页页头与内容的页面节点。
 */
export function PageContainer({ children, extra }: PageContainerProps) {
  const location = useLocation()
  const page = getWorkspacePageMetadata(location.pathname)
  const showHeader = page?.pageType === 'standard'

  return (
    <main aria-label={page ? `${page.title}页面内容` : '页面内容'} className="grid gap-4">
      {showHeader ? (
        <section className="rounded-lg border border-[#dfe5ec] bg-white px-6 py-4 shadow-[0_1px_4px_rgb(32_50_68_/_4%)] max-[720px]:px-4">
          <Breadcrumb items={page.breadcrumbs.map(title => ({ title }))} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <Typography.Title className="!m-0 !text-[24px] !leading-tight" level={1}>
              {page.title}
            </Typography.Title>
            {extra ? <div className="flex items-center gap-2">{extra}</div> : null}
          </div>
        </section>
      ) : null}
      {children}
    </main>
  )
}
