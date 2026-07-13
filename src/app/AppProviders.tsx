import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

/**
 * 应用共享的 TanStack Query 客户端。
 *
 * 统一约束查询缓存、失败重试和窗口聚焦后的刷新行为，避免页面各自创建客户端而丢失缓存。
 */
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
 * 为整棵应用组件树注入 UI 与数据请求相关的全局上下文。
 *
 * `ConfigProvider` 负责 Ant Design 的中文语言包和主题 Token，
 * `QueryClientProvider` 负责提供共享的 TanStack Query 客户端。
 *
 * @param props 应用级 Provider 的属性。
 * @param props.children 需要继承全局 UI 与数据请求上下文的子组件，通常为路由 Provider。
 * @returns 已注入全局上下文的组件树。
 */
export function AppProviders(props: PropsWithChildren) {
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
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </ConfigProvider>
  )
}
