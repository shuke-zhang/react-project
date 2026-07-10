import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

/**
 * 提供应用级上下文依赖。
 *
 * @param props 子节点内容。
 * @returns 包含 TanStack Query 客户端的上下文 Provider。
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#168b78',
          colorText: '#273142',
          colorBgLayout: '#eef1f5',
          borderRadius: 8,
          fontFamily: 'Microsoft YaHei, PingFang SC, sans-serif',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConfigProvider>
  )
}
