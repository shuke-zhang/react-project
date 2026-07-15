# 不可变状态更新 深度教程

## API 概述

通过新对象和新数组表达状态变化，保留可预测引用。

核心语法：`setItems(items => items.map(item => item.id === id ? { ...item, done: true } : item))`。典型场景：更新对象字段、列表项、嵌套表单和缓存快照。

## 基础用法

1. 先明确该能力解决的问题、状态所有权和调用边界。
2. 为 Props、状态、返回值和事件参数定义具体 TypeScript 类型。
3. 使用最小可运行示例验证渲染与交互，再逐步加入业务规则。

## Vue 3 对照

Vue reactive 允许代理对象原地写入；React 依赖 setter 和新引用。

Vue 通过响应式依赖追踪更新使用到数据的部分；React 把组件当函数重新执行，并让每次渲染读取固定状态快照。迁移时应先对齐数据流和副作用边界，而不是逐行翻译语法。

## React 与 Vue 的核心差异

- Vue 常通过 `ref`、`reactive`、`computed` 和 `watch` 组织响应式逻辑。
- React 通过 Props、状态快照、Hook 依赖和不可变更新组织单向数据流。
- React 状态不能直接修改；新状态依赖旧状态时使用函数式更新或 Reducer。
- Vue slot 对应 React children，Vue emit 对应回调 Props，Vue provide/inject 对应 Context。

## 常见错误

- 直接 push、splice 或改写旧对象后继续使用同一引用。
- 为了消除 lint 提示而隐藏依赖或使用 `any`。
- 在 JSX 中堆积复杂表达式，导致业务规则无法测试和复用。

## 推荐写法

- 通过领域事件和 Reducer 集中复杂不可变更新。
- 复杂逻辑提取为具名函数、自定义 Hook 或纯 Reducer。
- 使用稳定业务 ID，保持不可变更新，只在测量证明有收益时优化。

## 完整 TSX 示例

```tsx
import { useState } from 'react'

type Item = { id: string; title: string; done: boolean }
export function Demo() { const [items, setItems] = useState<Item[]>([{ id: 'one', title: '不可变更新', done: false }]); function toggle(id: string) { setItems(previousItems => previousItems.map(item => item.id === id ? { ...item, done: !item.done } : item)) } return <ul>{items.map(item => <li key={item.id}><button onClick={() => toggle(item.id)}>{item.done ? '已完成' : '待处理'} · {item.title}</button></li>)}</ul> }
```

## 企业级扩展

真实项目需要补充错误恢复、加载反馈、空状态、无障碍名称和公开行为测试。通过领域事件和 Reducer 集中复杂不可变更新。 对于服务器状态优先使用 TanStack Query，对外部未知数据先通过 Zod 校验，避免一个组件同时承担请求、缓存、校验和展示职责。
