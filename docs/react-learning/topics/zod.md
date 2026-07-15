# Zod 数据校验 深度教程

## API 概述

在运行时校验未知数据，并把校验结果收窄为可信 TypeScript 类型。

核心语法：`const result = schema.safeParse(input)`。典型场景：接口响应、表单提交、URL 参数和本地存储边界。

## 基础用法

1. 先明确该能力解决的问题、状态所有权和调用边界。
2. 为 Props、状态、返回值和事件参数定义具体 TypeScript 类型。
3. 使用最小可运行示例验证渲染与交互，再逐步加入业务规则。

## Vue 3 对照

React/Vue 均可使用 Zod；区别只在表单和响应式集成。

Vue 通过响应式依赖追踪更新使用到数据的部分；React 把组件当函数重新执行，并让每次渲染读取固定状态快照。迁移时应先对齐数据流和副作用边界，而不是逐行翻译语法。

## React 与 Vue 的核心差异

- Vue 常通过 `ref`、`reactive`、`computed` 和 `watch` 组织响应式逻辑。
- React 通过 Props、状态快照、Hook 依赖和不可变更新组织单向数据流。
- React 状态不能直接修改；新状态依赖旧状态时使用函数式更新或 Reducer。
- Vue slot 对应 React children，Vue emit 对应回调 Props，Vue provide/inject 对应 Context。

## 常见错误

- 只写 TypeScript 接口就相信外部数据，或在 UI 深处重复解析。
- 为了消除 lint 提示而隐藏依赖或使用 `any`。
- 在 JSX 中堆积复杂表达式，导致业务规则无法测试和复用。

## 推荐写法

- 在系统边界解析 unknown，使用 transform 与 discriminatedUnion 表达领域模型。
- 复杂逻辑提取为具名函数、自定义 Hook 或纯 Reducer。
- 使用稳定业务 ID，保持不可变更新，只在测量证明有收益时优化。

## 完整 TSX 示例

```tsx
import { z } from 'zod'
import { useState } from 'react'

const UserSchema = z.object({ name: z.string().min(2), age: z.number().int().positive() })
export function Demo() { const [result, setResult] = useState('等待校验'); function validate() { const parsed = UserSchema.safeParse({ name: '林晓', age: 28 }); setResult(parsed.success ? `通过：${parsed.data.name}` : '校验失败') } return <><button onClick={validate}>校验未知数据</button><p>{result}</p></> }
```

## 企业级扩展

真实项目需要补充错误恢复、加载反馈、空状态、无障碍名称和公开行为测试。在系统边界解析 unknown，使用 transform 与 discriminatedUnion 表达领域模型。 对于服务器状态优先使用 TanStack Query，对外部未知数据先通过 Zod 校验，避免一个组件同时承担请求、缓存、校验和展示职责。
