import { Button, Form, Input, message, Typography } from 'antd'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '@/api/session'
import styles from './LoginView.module.scss'

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
 * 渲染企业工作台登录页。
 *
 * 视觉样式由同目录的 SCSS Module 管理，组件只保留登录交互、结构和无障碍语义。
 *
 * @returns 登录表单和登录页视觉背景组成的页面节点。
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
    <main className={styles.page}>
      <div className={styles.gridBackground} aria-hidden="true" />
      <div className={styles.glassPanel} aria-hidden="true" />
      <div className={styles.lightBand} aria-hidden="true" />

      <header className={styles.header} aria-label="企业级 React 模板">
        <span className={styles.brandMark} aria-hidden="true">
          <span className={styles.brandStrokeOne} />
          <span className={styles.brandStrokeTwo} />
          <span className={styles.brandStrokeThree} />
        </span>
      </header>

      <section className={styles.content} aria-label="工作台登录">
        <div className={styles.visualPanel} aria-hidden="true">
          <span className={styles.visualOrb}>
            <span className={styles.visualHighlight} />
            <span className={styles.visualRing} />
          </span>
          <span className={styles.visualShadow} />
        </div>

        <section className={styles.loginCard} aria-labelledby="login-title">
          <div className={styles.cardHighlight} aria-hidden="true" />
          <div className={styles.cardHeading}>
            <span className={styles.eyebrow}>SECURE ACCESS</span>
            <Typography.Title className={styles.title} id="login-title" level={2}>欢迎回来</Typography.Title>
            <Typography.Text className={styles.description}>使用已配置账号登录企业控制台。</Typography.Text>
          </div>

          <Form<LoginFormValues>
            className={styles.form}
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
