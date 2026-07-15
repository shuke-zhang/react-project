import { Button, Card } from 'antd'
import { Fragment, useState } from 'react'
import { BasicContainer } from '@/components/BasicContainer'

/**
 * 系统字典管理路由占位视图。
 *
 * @returns 使用标准业务页容器呈现的系统字典占位页面。
 */
export function SystemDictView() {
  const [flag, setFlag] = useState(true)

  const list = [
    { name: '张三', age: '18' },
    { name: '李四', age: '19' },
    { name: '王二', age: '120' },
  ]
  let content = <span style={{ color: 'green' }}>测试</span>

  if (!flag) {
    // content = <span style={{ color: 'red' }}>测试</span>
    content = list.map((it) => {
      return (
        <Fragment key={it.age}>
          <p style={{ color: 'red' }}>
            {it.name}
            ---
            {it.age}
          </p>
          <p>--</p>
        </Fragment>
      )
    })
  }

  const handleToggleFlag = () => {
    setFlag(previousFlag => !previousFlag)
  }

  return (

    <BasicContainer>
      <Card>
        <div title={flag ? '测试：开启状态' : '测试：关闭状态'}>
          {content}
        </div>

        <div>控制是否显示</div>

        <Button onClick={handleToggleFlag} style={{}}>
          点击切换 flag：
          {flag ? 'true' : 'false'}
        </Button>
      </Card>
    </BasicContainer>
  )
}