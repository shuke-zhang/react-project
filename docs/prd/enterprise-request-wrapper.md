# PRD：企业级 request 封装

## 问题说明

当前企业级 React 项目模板已经具备登录会话、访问令牌续期、运行时配置和用户数据 adapter，但业务请求封装仍偏基础。调用方主要依赖 axios 实例行为，缺少统一的业务响应解包、业务错误识别、中文错误提示、便捷方法和请求级开关。

这会导致后续接入真实后端时，不同业务 module 可能重复处理 `{ code, data, msg, success }` 这类响应结构，重复判断 `401`、`403`、`500`，重复决定是否展示错误提示，也会让 `FormData`、`URLSearchParams`、`blob`、原始响应等场景分散到 callers 中。

## 解决方案

构建一个完整、全面、便捷的企业级 request module。它应继续复用现有登录会话 seam 和运行时配置 seam，同时在 request interface 内集中处理业务响应、HTTP 错误、请求 headers、访问令牌注入、刷新令牌重试和快捷方法。

业务代码默认应能通过 `request<T>()` 或 `get/post/put/del/postForm` 直接拿到业务数据；需要特殊行为时，通过 `rawResponse`、`showError`、`skipToken`、`skipRefresh` 等 request config 明确声明，而不是复制内部处理逻辑。

## 用户故事

1. 作为前端开发者，我希望 `request<T>()` 默认返回类型化的业务数据，从而避免业务 module 反复解包 axios 响应。
2. 作为前端开发者，我希望提供 `get<T>()`、`post<T>()`、`put<T>()`、`del<T>()` 和 `postForm<T>()` 快捷方法，从而让常见 REST 调用更简洁一致。
3. 作为前端开发者，我希望定义 `ApiResponse<T>` 类型，兼容 `code`、`data`、`msg`、`message` 和 `success`，从而集中处理常见后端响应格式。
4. 作为前端开发者，我希望把 `0`、`200`、`'0'`、`'200'` 识别为业务成功码，从而兼容 Blade 风格和常见 REST 包装格式。
5. 作为前端开发者，我希望业务响应中的 `401` 和 `'401'` 进入与 HTTP 401 相同的登录会话恢复流程，从而让业务错误和 HTTP 错误行为一致。
6. 作为前端开发者，我希望支持 `rawResponse: true`，从而让下载、上传、分页元数据和特殊接口可以跳过自动业务数据解包。
7. 作为前端开发者，我希望 `responseType: 'blob'` 自动跳过普通业务响应解包，从而让文件下载自然可用。
8. 作为前端开发者，我希望支持 `showError: false`，从而让页面在需要自定义行内错误时可以关闭全局错误提示。
9. 作为前端开发者，我希望支持 `skipToken: true`，从而让公开接口可以不携带访问令牌。
10. 作为前端开发者，我希望支持 `skipRefresh: true`，从而让登录、刷新令牌和明确未认证的请求不会触发刷新令牌重试循环。
11. 作为前端开发者，我希望 `FormData` 请求自动避免手动设置 `Content-Type`，从而让浏览器正确生成 multipart boundary。
12. 作为前端开发者，我希望 `URLSearchParams` 请求在未显式设置内容类型时自动设置 `application/x-www-form-urlencoded;charset=UTF-8`，从而更方便地调用表单类接口。
13. 作为产品用户，我希望访问令牌过期时系统能优先自动使用刷新令牌续期，从而避免正常使用过程中频繁回到登录页。
14. 作为产品用户，我希望刷新令牌失败或登录会话无效时看到清晰的中文提示并跳转登录页，从而理解发生了什么。
15. 作为产品用户，我希望服务端错误显示可读的中文信息，从而避免看到原始技术错误。
16. 作为前端开发者，我希望统一处理 `400`、`401`、`403`、`404`、`408`、`500`、`502`、`503`、`504` 等 HTTP 状态，从而让标准失败场景行为一致。
17. 作为前端开发者，我希望超时和网络异常映射为清晰中文提示，从而避免每个 caller 自己解析 axios 错误。
18. 作为前端开发者，我希望后端返回的 `msg` 或 `message` 优先于通用状态提示，从而保留服务端提供的业务错误说明。
19. 作为前端开发者，我希望 request module 继续使用 `runtimeConfig`，从而让 `baseURL`、请求超时和 Blade 配置保持集中管理。
20. 作为前端开发者，我希望 request 测试覆盖外部行为，而不是绑定内部实现细节，从而让后续内部重构仍然安全。
21. 作为前端开发者，我希望 request module 不直接负责 router 或 hash 跳转，从而让导航行为继续由登录会话订阅流程拥有。
22. 作为前端开发者，我希望 request module 只在必要时暴露 axios 实例，从而让大多数 callers 使用更深的 request interface。
23. 作为前端开发者，我希望业务响应解包产生的错误以 rejected promise 形式抛出，从而让 React Query 和 mutation flow 能自然处理。
24. 作为前端开发者，我希望现有用户数据 adapter 在 request module 增强后继续可用，从而让这次改造保持增量、安全。

## 实现决策

- 在现有 request module 上增强，而不是整体替换。
- 登录会话继续由现有 session module 拥有。request module 可以请求登录会话 module 进行刷新或过期处理，但不能拥有刷新状态、localStorage 细节或导航逻辑。
- 运行时配置继续由现有 runtime config module 拥有。request module 不应硬编码 `baseURL`、请求超时、Blade tenant 或 Blade client 配置。
- 新增类型化 request config，在 axios config 基础上支持 `rawResponse`、`showError`、`skipToken`、`skipRefresh` 和内部 retry 状态。
- 新增类型化业务响应结构，兼容 `code`、`data`、`msg`、`message` 和 `success`。
- 当 `success === true` 或 `code` 属于 `0`、`200`、`'0'`、`'200'` 时，视为业务成功。
- 当业务响应 `code` 为 `401` 或 `'401'` 且允许刷新时，进入与 HTTP 401 相同的登录会话恢复流程。
- 保留当前访问令牌重试行为：遇到 401 后刷新登录会话一次，重写 `Blade-Auth`，重放原请求一次；刷新或重放失败后才让登录会话过期。
- 新增 `request`、`get`、`post`、`put`、`del` 和 `postForm` 快捷方法。
- 增加标准 HTTP 状态、超时和网络异常的集中中文错误提示。
- 允许 caller 通过 `showError: false` 关闭全局错误提示。
- 保留原始响应和 `blob` 的特殊处理。
- 集中处理 `FormData` 和 `URLSearchParams` 的 headers。
- 全局 request 错误提示使用 Ant Design `message`，但登录跳转仍由登录会话订阅流程负责。
- 除非为了证明新 interface 必须迁移，否则不要在同一变更中迁移无关业务 module。

## 测试决策

- 通过 `src/utils/request` 的 public interface 测试：`request<T>()`、快捷方法、request config 开关、业务响应解包、错误映射和特殊响应行为。
- 通过现有登录会话 seam 测试 401 恢复：刷新成功后重放原请求；刷新失败后让登录会话过期。
- 通过现有运行时配置 seam 测试 request 仍从集中配置获取 `baseURL` 和请求超时。
- 通过 request config 和 adapter 观察测试 `FormData`、`URLSearchParams` 的 header 行为。
- 测试业务响应成功和失败时，不绑定私有 helper；除非这些 helper 被明确设计为 public interface。
- 复用现有 request tests 作为 axios adapter 行为测试的先例。
- 保留现有 session tests，确保刷新令牌单飞行为仍然成立。
- 实现后运行单元测试、类型检查、lint 和生产构建。

## 不在范围内

- 替换 axios 为其他 HTTP client。
- 改变后端响应契约。
- 实现真实用户后端接口。
- 改变所有页面的 React Query 使用方式。
- 添加权限菜单、角色权限、部门树、操作审计或分页功能。
- 把导航或登录跳转放进 request module。
- 重做登录会话持久化模型。

## 补充说明

- 设计参考了 `C:\Users\lenovo\Desktop\yuxi-school-react\src\api\fetch.ts` 中较完整的 request 封装，但不复制其中的 router/store 耦合方式。
- Ant Design Pro 的 request 错误处理提供了一个有价值的方向：把业务失败转成统一 request 错误，并集中决定展示方式。
- Axios interceptors 适合作为请求 header 规范化、响应处理和 HTTP 错误恢复的 seam。
- 用户可见提示和文档默认使用简体中文；代码标识符、HTTP 术语和库名可以保持英文。
