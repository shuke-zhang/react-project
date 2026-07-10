import type { CSSProperties, ReactNode } from 'react'

/**
 * 滚动条容器属性。
 */
interface ScrollbarProps {
  /** 容器高度，默认撑满父级。 */
  height?: string | number
  /** 自定义类名。 */
  className?: string
  /** 自定义内联样式。 */
  style?: CSSProperties
  /** 滚动区域内容。 */
  children: ReactNode
}

/**
 * 简易滚动条容器。
 *
 * 基于 `overflow-auto` 配合 WebKit 与 Firefox 的自定义滚动条样式，
 * 提供统一的细窄滚动条外观，不依赖任何第三方滚动条库。
 *
 * @param props 滚动条容器的高度、类名、样式与内容。
 * @returns 带自定义滚动条样式的可滚动容器节点。
 */
export function Scrollbar({ height = '100%', className, style, children }: ScrollbarProps) {
  return (
    <div
      className={[
        'overflow-auto',
        '[scrollbar-width:thin] [scrollbar-color:#c1c7d0_transparent]',
        '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c1c7d0]',
        '[&::-webkit-scrollbar-thumb:hover]:bg-[#a3abb8]',
        className,
      ].filter(Boolean).join(' ')}
      style={{ height, ...style }}
    >
      {children}
    </div>
  )
}
