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
 * 渲染具备亮色绿蓝玻璃拟态质感的工作台登录页。
 *
 * @returns 登录表单和纯视觉玻璃背景组成的页面节点。
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
      <div className="login-page__ambient" aria-hidden="true" />
      <div className="login-page__glass-ribbon" aria-hidden="true" />
      <div className="login-page__liquid-field" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="login-page__brand" aria-label="企业级 React 模板">
        <span className="login-page__brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </header>

      <section className="login-page__layout" aria-label="工作台登录">
        <div className="login-page__visual" aria-hidden="true">
          <span className="login-page__visual-pane login-page__visual-pane--large" />
          <span className="login-page__visual-pane login-page__visual-pane--small" />
          <span className="login-page__visual-panel">
            <span />
            <span />
            <span />
          </span>
          <span className="login-page__visual-ring" />
          <span className="login-page__visual-orbit login-page__visual-orbit--blue" />
          <span className="login-page__visual-orbit login-page__visual-orbit--green" />
          <span className="login-page__visual-liquid login-page__visual-liquid--mint" />
          <span className="login-page__visual-liquid login-page__visual-liquid--cyan" />
        </div>

        <section className="login-page__panel" aria-labelledby="login-title">
          <div className="login-page__panel-shine" aria-hidden="true" />
          <div className="login-page__panel-liquid" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="login-page__heading">
            <span>SECURE ACCESS</span>
            <Typography.Title id="login-title" level={2}>欢迎回来</Typography.Title>
            <Typography.Text>使用已配置账号登录企业控制台。</Typography.Text>
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
              {loading ? '正在登录...' : '登录工作台'}
            </Button>
          </Form>
        </section>
      </section>
    </main>
  )
}
