import { useEffect, useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { type LoginSessionExpiredDetail, subscribeLoginSessionExpired } from '@/api/session'

export function MainLayoutShell() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    function handleExpired(detail: LoginSessionExpiredDetail) {
      void message.warning(detail.message)
      navigate('/login', { replace: true })
    }

    return subscribeLoginSessionExpired(handleExpired)
  }, [navigate])

  return <MainLayout collapsed={collapsed} onToggleCollapsed={() => setCollapsed(value => !value)} />
}
