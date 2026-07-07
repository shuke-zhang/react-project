import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { router } from '@/router'

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
