import type { CSSProperties, ReactNode } from 'react'

/**
 * 原生滚动区域的配置。
 *
 * `Scrollbar` 不模拟滚动行为，也不管理页面布局；它只为内容区域提供可滚动的原生元素和统一外观。
 */
interface ScrollbarProps {
  /** 容器高度，默认撑满父级；可使用任意合法的 CSS 高度值。 */
  height?: string | number
  /** 追加到滚动元素的样式类名，用于页面级间距或局部外观调整。 */
  className?: string
  /** 追加到滚动元素的内联样式；其中的 `height` 会覆盖 `height` 属性。 */
  style?: CSSProperties
  /** 放入可滚动区域的业务内容。 */
  children: ReactNode
}

/**
 * 渲染带统一外观的原生滚动区域。
 *
 * 基于 `overflow-auto` 配合 WebKit 与 Firefox 的滚动条样式，保留浏览器原生的触摸、
 * 键盘与辅助技术行为，同时提供细窄一致的外观。不依赖第三方滚动条库，也不负责页面标题、
 * 面包屑或导航等结构能力。
 *
 * @param props 原生滚动区域的配置。
 * @param props.height 滚动区域高度，未传入时默认撑满父级。
 * @param props.className 追加到滚动元素的样式类名。
 * @param props.style 追加到滚动元素的内联样式。
 * @param props.children 要放入滚动区域的业务内容。
 * @returns 带跨浏览器滚动条样式的原生可滚动容器节点。
 */
export function Scrollbar({ height = '100%', className, style, children }: ScrollbarProps) {
  return (
    <div
      className={[
        'overflow-auto',
        'scrollbar-thin [scrollbar-color:#c1c7d0_transparent]',
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
