import { ApiOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic, Typography } from 'antd'
import './HomeView.css'

export function HomeView() {
  return (
    <main className="home-view">
      <section className="home-view__hero">
        <p>ENTERPRISE TEMPLATE</p>
        <h1>企业级 React 项目模板</h1>
        <span>内置真实登录、路由守卫、请求封装、接口校验和用户 CRUD 示例，适合作为正式业务项目起点。</span>
      </section>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="基础页面" value={3} prefix={<ApiOutlined />} suffix="个" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="用户示例" value={3} prefix={<TeamOutlined />} suffix="条" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="登录守卫" value="已启用" prefix={<SafetyCertificateOutlined />} />
          </Card>
        </Col>
      </Row>
      <Card className="home-view__card">
        <Typography.Title level={4}>模板能力</Typography.Title>
        <Typography.Paragraph>
          当前模板聚焦企业后台常见基础能力，不绑定具体业务领域。用户管理页使用 REST 风格 mock 接口，后续可以替换为真实后端服务。
        </Typography.Paragraph>
      </Card>
    </main>
  )
}
