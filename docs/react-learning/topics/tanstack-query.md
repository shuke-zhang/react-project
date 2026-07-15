# TanStack Query 深度教程

## API 概述

管理服务器状态的请求、缓存、失效、重试和并发。

核心语法：`useQuery({ queryKey, queryFn })`。典型场景：列表查询、详情缓存、mutation 和乐观更新。

## 基础用法

1. 先明确该能力解决的问题、状态所有权和调用边界。
2. 为 Props、状态、返回值和事件参数定义具体 TypeScript 类型。
3. 使用最小可运行示例验证渲染与交互，再逐步加入业务规则。

## Vue 3 对照

对应 @tanstack/vue-query；核心缓存模型一致，响应式适配不同。

Vue 通过响应式依赖追踪更新使用到数据的部分；React 把组件当函数重新执行，并让每次渲染读取固定状态快照。迁移时应先对齐数据流和副作用边界，而不是逐行翻译语法。

## React 与 Vue 的核心差异

- Vue 常通过 `ref`、`reactive`、`computed` 和 `watch` 组织响应式逻辑。
- React 通过 Props、状态快照、Hook 依赖和不可变更新组织单向数据流。
- React 状态不能直接修改；新状态依赖旧状态时使用函数式更新或 Reducer。
- Vue slot 对应 React children，Vue emit 对应回调 Props，Vue provide/inject 对应 Context。

## 常见错误

- 把服务器数据再复制到 useState，或使用不稳定对象作为 queryKey。
- 为了消除 lint 提示而隐藏依赖或使用 `any`。
- 在 JSX 中堆积复杂表达式，导致业务规则无法测试和复用。

## 推荐写法

- 建立查询键工厂、统一错误策略和精确失效边界。
- 复杂逻辑提取为具名函数、自定义 Hook 或纯 Reducer。
- 使用稳定业务 ID，保持不可变更新，只在测量证明有收益时优化。

## 完整 TSX 示例

```tsx
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const client = new QueryClient()
function Status() { const query = useQuery({ queryKey: ['learning-status'], queryFn: async () => { await new Promise(r => setTimeout(r, 500)); return '缓存加载完成' } }); return <p>{query.isPending ? '加载中…' : query.data}</p> }
export function Demo() { return <QueryClientProvider client={client}><Status /></QueryClientProvider> }
```

## 企业级扩展

真实项目需要补充错误恢复、加载反馈、空状态、无障碍名称和公开行为测试。建立查询键工厂、统一错误策略和精确失效边界。 对于服务器状态优先使用 TanStack Query，对外部未知数据先通过 Zod 校验，避免一个组件同时承担请求、缓存、校验和展示职责。
