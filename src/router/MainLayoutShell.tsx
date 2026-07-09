import { useEffect, useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { type LoginSessionExpiredDetail, subscribeLoginSessionExpired } from '@/api/session'

/**
 * 主布局外壳，负责布局状态和登录会话过期订阅。
 *
 * @returns 主布局节点。
 */
export function MainLayoutShell() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    /**
     * 处理全局登录会话过期事件。
     *
     * @param detail 登录会话过期事件详情。
     */
    function handleExpired(detail: LoginSessionExpiredDetail) {
      void message.warning(detail.message)
      navigate('/login', { replace: true })
    }

    return subscribeLoginSessionExpired(handleExpired)
  }, [navigate])

  return <MainLayout collapsed={collapsed} onToggleCollapsed={() => setCollapsed(value => !value)} />
}
