import { Spin } from 'antd'

/**
 * 页面级加载状态组件。
 *
 * @returns 带有无障碍状态说明的加载节点。
 */
export function PageLoading() {
  return (
    <div className="grid min-h-60 place-items-center" role="status" aria-label="页面加载中">
      <Spin tip="页面加载中..." />
    </div>
  )
}
