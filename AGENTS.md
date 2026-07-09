## Agent skills

### Issue tracker

Issues 和 PRD 记录在 GitHub Issues 中。外部 PR 不作为 triage 输入面处理。详见 `docs/agents/issue-tracker.md`。

### Triage labels

本仓库使用 mattpocock/skills 的默认 triage labels：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human` 和 `wontfix`。详见 `docs/agents/triage-labels.md`。

### Domain docs

本仓库使用 single-context 领域文档布局：根目录 `CONTEXT.md` 加 `docs/adr/`。详见 `docs/agents/domain.md`。

## 注释规范

本仓库要求代码具备清晰、稳定、可维护的中文注释。Agent 在新增、修改或重构代码时，必须同步补充或更新注释，确保注释与代码行为保持一致。

### 基本要求

- 默认情况下，所有新增函数、封装函数、hooks、组件核心方法、工具函数、API 方法、请求封装、状态管理方法、业务服务方法都应编写 JSDoc 注释。
- 对外暴露的函数、组件、hooks、工具函数、API 封装、请求封装、状态管理封装、业务服务方法必须编写 JSDoc 注释。
- 复杂业务函数、复杂条件分支、数据转换逻辑、权限判断逻辑、兼容处理逻辑、异常兜底逻辑，即使不是对外暴露，也必须补充必要注释。
- JSDoc 的描述、`@param`、`@returns`、`@throws`、`@example` 等内容必须使用简体中文。
- 禁止使用普通块注释替代 JSDoc 来描述公共 API。
- 禁止编写无意义注释，例如只重复变量名、函数名或代码表面行为的注释。
- 简单自解释的局部变量、简单事件绑定、简单 getter/setter 可以不写注释，避免注释噪音。
- 修改已有函数签名、参数含义、返回结构、异常行为或关键副作用时，必须同步更新对应 JSDoc。
- 新增封装时，注释应优先说明“用途、入参含义、返回值结构、异常场景、关键副作用”。

### 推荐注释范围

以下代码原则上都需要 JSDoc 注释：

- `export function`
- `export const xxx = (...) => {}`
- 自定义 hooks，例如 `useUserInfo`、`useRequest`、`useTable`
- API 请求方法，例如 `getUserList`、`createOrder`
- 工具函数，例如 `formatDate`、`buildTree`、`downloadFile`
- 业务服务函数，例如 `submitForm`、`buildReportSummary`
- 复杂组件的 props 类型、核心事件方法、数据转换方法
- Pinia/Vuex store 中的 actions、getters、复杂状态更新方法
- 请求拦截器、响应拦截器、错误处理器、权限守卫、路由守卫
- 第三方服务封装、浏览器兼容封装、文件上传/下载封装

### 行内注释要求

- 简单自解释代码不强制添加行内注释。
- 复杂分支、特殊兼容、历史原因、外部服务兜底、临时规避方案可以添加简短行内注释。
- 行内注释必须使用简体中文。
- 行内注释应解释“为什么这样做”，不要只描述“代码正在做什么”。

### 示例

```ts
/**
 * 获取用户分页列表。
 *
 * @param params 用户列表查询参数，包含页码、每页数量和筛选条件。
 * @returns 用户分页数据。
 */
export function getUserPage(params: UserPageParams): Promise<PageResult<UserItem>> {
  return request.get('/users', { params })
}

/**
 * 管理用户列表页面的数据加载、分页和筛选状态。
 *
 * @returns 用户列表页面所需的状态和操作方法。
 */
export function useUserTable() {
  // ...
}

/**
 * 提交表单并在成功后刷新列表。
 *
 * @throws 当表单校验失败或接口提交失败时抛出错误。
 */
async function handleSubmit(): Promise<void> {
  // ...
}