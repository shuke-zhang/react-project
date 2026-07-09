import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

/**
 * 404 页面。
 *
 * @returns 页面不存在时展示的结果页节点。
 */
export function NotFoundView() {
  return (
    <Result
      status="404"
      title="页面未找到"
      subTitle="当前访问的页面不存在或已经被移动。"
      extra={<Button type="primary"><Link to="/home">返回首页</Link></Button>}
    />
  )
}
