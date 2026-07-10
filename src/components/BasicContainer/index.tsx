import type { ReactNode } from 'react'
import { Scrollbar } from '@/components/Scrollbar'

/**
 * 基础容器属性。
 */
interface BasicContainerProps {
  /** 自定义类名，会与默认样式合并。 */
  className?: string
  /** 容器内容。 */
  children: ReactNode
}

/**
 * 基础页面容器。
 *
 * 提供白底背景与撑满父级的滚动区域，配合 `Scrollbar` 统一滚动条外观，
 * 适合作为业务页面的通用内容包裹器。
 *
 * @param props 容器类名与内容。
 * @returns 带白底与滚动条的容器节点。
 */
export function BasicContainer({ className, children }: BasicContainerProps) {
  return (
    <div className={['bg-white h-full min-h-0 min-w-0', className].filter(Boolean).join(' ')}>
      <Scrollbar height="100%" className="p-4">
        {children}
      </Scrollbar>
    </div>
  )
}
