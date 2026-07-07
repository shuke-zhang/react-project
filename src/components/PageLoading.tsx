import { Spin } from 'antd'
import './PageLoading.css'

export function PageLoading() {
  return (
    <div className="page-loading" role="status" aria-label="页面加载中">
      <Spin tip="页面加载中..." />
    </div>
  )
}
