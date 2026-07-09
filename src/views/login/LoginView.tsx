import { Button, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '@/api/session'
import './LoginView.css'

interface LoginFormValues {
  username: string
  password: string
}

/**
 * 从路由状态中读取登录成功后的回跳路径。
 *
 * @param state React Router location state。
 * @returns 合法的站内回跳路径；缺失或非法时回到首页。
 */
function getRedirectPath(state: unknown): string {
  const maybeState = state as { from?: string } | null
  return maybeState?.from && maybeState.from.startsWith('/') ? maybeState.from : '/home'
}

/**
 * 登录页面。
 *
 * @returns 登录表单和产品说明区域。
 */
export function LoginView() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * 提交登录表单并在成功后跳转到目标页面。
   *
   * @param values 登录表单值。
   */
  async function handleFinish(values: LoginFormValues) {
    setLoading(true)

    try {
      await login(values.username, values.password)
      navigate(getRedirectPath(location.state), { replace: true })
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请稍后重试'
      void message.error(errorMessage)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-page__grid" aria-hidden="true" />
      <div className="login-page__brand">
        <span className="login-page__brand-mark">+</span>
        <span>
          <strong>企业级 React 模板</strong>
          <small>ENTERPRISE TEMPLATE</small>
        </span>
      </div>
      <section className="login-page__layout">
        <div className="login-page__intro">
          <span>ENTERPRISE WORKSPACE</span>
          <h1>专业后台工作台</h1>
          <p>登录后进入企业级 React 项目模板，体验真实认证、路由守卫、请求封装和用户 CRUD 示例。</p>
          <ul>
            <li><span>01</span> 真实 Blade 登录接口</li>
            <li><span>02</span> React Router 登录守卫</li>
            <li><span>03</span> TanStack Query 数据管理</li>
          </ul>
        </div>
        <div className="login-page__panel">
          <div className="login-page__heading">
            <Typography.Title level={3}>工作台登录</Typography.Title>
            <Typography.Text type="secondary">请使用已配置账号登录</Typography.Text>
          </div>
          <Form<LoginFormValues>
            layout="vertical"
            initialValues={{ username: 'shuke', password: 'zhang123456' }}
            onFinish={handleFinish}
          >
            <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号' }]}>
              <Input autoComplete="username" placeholder="请输入账号" size="large" />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password autoComplete="current-password" placeholder="请输入密码" size="large" />
            </Form.Item>
            <Button block htmlType="submit" loading={loading} size="large" type="primary">
              {loading ? '正在登录...' : '登录'}
            </Button>
          </Form>
        </div>
      </section>
    </main>
  )
}
