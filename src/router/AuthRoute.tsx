import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '@/api/session'

/**
 * 登录会话路由守卫。
 *
 * @param props 子节点内容。
 * @returns 已登录时渲染子节点；未登录时跳转登录页并记录来源路径。
 */
export function AuthRoute({ children }: PropsWithChildren) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
