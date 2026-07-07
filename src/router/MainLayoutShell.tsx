import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'

export function MainLayoutShell() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    function handleExpired() {
      navigate('/login', { replace: true })
    }

    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [navigate])

  return <MainLayout collapsed={collapsed} onToggleCollapsed={() => setCollapsed(value => !value)} />
}
