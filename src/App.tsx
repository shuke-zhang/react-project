import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { router } from '@/router'

/**
 * 应用根组件。
 *
 * @returns 包含应用级 Provider 和路由的根节点。
 */
export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
