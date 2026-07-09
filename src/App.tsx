import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { router } from '@/router'

/**
 * 应用根组件。
 *
 * @returns 包含中文本地化、主题配置、全局 Provider 和路由的根节点。
 */
export function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#0d6074',
          borderRadius: 6,
          fontFamily: 'Microsoft YaHei, PingFang SC, sans-serif',
        },
      }}
    >
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ConfigProvider>
  )
}
