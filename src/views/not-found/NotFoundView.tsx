import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

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
