# 状态快照与批处理 深度教程

## API 概述

理解每次渲染读取固定状态快照，以及 React 如何批处理更新。

核心语法：`setCount(count => count + 1)`。典型场景：连续更新计数、异步事件和并发渲染。

## 基础用法

1. 先明确该能力解决的问题、状态所有权和调用边界。
2. 为 Props、状态、返回值和事件参数定义具体 TypeScript 类型。
3. 使用最小可运行示例验证渲染与交互，再逐步加入业务规则。

## Vue 3 对照

Vue 将响应式变更放入更新队列；React setter 将更新加入下一次渲染队列。

Vue 通过响应式依赖追踪更新使用到数据的部分；React 把组件当函数重新执行，并让每次渲染读取固定状态快照。迁移时应先对齐数据流和副作用边界，而不是逐行翻译语法。

## React 与 Vue 的核心差异

- Vue 常通过 `ref`、`reactive`、`computed` 和 `watch` 组织响应式逻辑。
- React 通过 Props、状态快照、Hook 依赖和不可变更新组织单向数据流。
- React 状态不能直接修改；新状态依赖旧状态时使用函数式更新或 Reducer。
- Vue slot 对应 React children，Vue emit 对应回调 Props，Vue provide/inject 对应 Context。

## 常见错误

- 调用 setter 后立刻读取旧变量，误以为它已同步改变。
- 为了消除 lint 提示而隐藏依赖或使用 `any`。
- 在 JSX 中堆积复杂表达式，导致业务规则无法测试和复用。

## 推荐写法

- 依赖旧值时使用 updater，并用事件边界组织一组原子更新。
- 复杂逻辑提取为具名函数、自定义 Hook 或纯 Reducer。
- 使用稳定业务 ID，保持不可变更新，只在测量证明有收益时优化。

## 完整 TSX 示例

```tsx
import { useState } from 'react'

export function Demo() { const [count, setCount] = useState(0); function addThree() { setCount(previous => previous + 1); setCount(previous => previous + 1); setCount(previous => previous + 1) } return <button onClick={addThree}>批处理后计数：{count}</button> }
```

## 企业级扩展

真实项目需要补充错误恢复、加载反馈、空状态、无障碍名称和公开行为测试。依赖旧值时使用 updater，并用事件边界组织一组原子更新。 对于服务器状态优先使用 TanStack Query，对外部未知数据先通过 Zod 校验，避免一个组件同时承担请求、缓存、校验和展示职责。
