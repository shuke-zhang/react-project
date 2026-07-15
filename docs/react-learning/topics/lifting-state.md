# 状态提升 深度教程

## API 概述

把共享状态移动到最近公共父组件以保持单一数据源。

核心语法：`const [selectedId, setSelectedId] = useState<string | null>(null)`。典型场景：同步两个筛选组件、手风琴或主从详情选择。

## 基础用法

1. 先明确该能力解决的问题、状态所有权和调用边界。
2. 为 Props、状态、返回值和事件参数定义具体 TypeScript 类型。
3. 使用最小可运行示例验证渲染与交互，再逐步加入业务规则。

## Vue 3 对照

对应把 ref 提升到父组件，再通过 props 与 emit 同步。

Vue 通过响应式依赖追踪更新使用到数据的部分；React 把组件当函数重新执行，并让每次渲染读取固定状态快照。迁移时应先对齐数据流和副作用边界，而不是逐行翻译语法。

## React 与 Vue 的核心差异

- Vue 常通过 `ref`、`reactive`、`computed` 和 `watch` 组织响应式逻辑。
- React 通过 Props、状态快照、Hook 依赖和不可变更新组织单向数据流。
- React 状态不能直接修改；新状态依赖旧状态时使用函数式更新或 Reducer。
- Vue slot 对应 React children，Vue emit 对应回调 Props，Vue provide/inject 对应 Context。

## 常见错误

- 同一业务值在多个子组件各存一份，产生同步 Effect。
- 为了消除 lint 提示而隐藏依赖或使用 `any`。
- 在 JSX 中堆积复杂表达式，导致业务规则无法测试和复用。

## 推荐写法

- 判断状态所有权，避免无条件提升到页面或全局。
- 复杂逻辑提取为具名函数、自定义 Hook 或纯 Reducer。
- 使用稳定业务 ID，保持不可变更新，只在测量证明有收益时优化。

## 完整 TSX 示例

```tsx
import { useState } from 'react'

function TemperatureInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label>{label}<input type="number" value={value} onChange={event => onChange(Number(event.target.value))} /></label> }
export function Demo() { const [celsius, setCelsius] = useState(0); return <><TemperatureInput label="摄氏度" value={celsius} onChange={setCelsius} /><TemperatureInput label="华氏度" value={celsius * 9 / 5 + 32} onChange={value => setCelsius((value - 32) * 5 / 9)} /></> }
```

## 企业级扩展

真实项目需要补充错误恢复、加载反馈、空状态、无障碍名称和公开行为测试。判断状态所有权，避免无条件提升到页面或全局。 对于服务器状态优先使用 TanStack Query，对外部未知数据先通过 Zod 校验，避免一个组件同时承担请求、缓存、校验和展示职责。
