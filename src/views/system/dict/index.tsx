import { Card, Typography } from 'antd'
import { PageContainer } from '@/components/PageContainer'

/**
 * 系统字典管理路由占位视图。
 *
 * @returns 使用标准业务页容器呈现的系统字典占位页面。
 */
export function SystemDictView() {
  return (
    <PageContainer>
      <Card>
        <Typography.Paragraph className="!mb-0">系统字典功能将在此处扩展。</Typography.Paragraph>
      </Card>
    </PageContainer>
  )
}
