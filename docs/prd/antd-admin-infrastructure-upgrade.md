# PRD：基于 Ant Design 的企业后台基础设施升级

> 更新说明：其中关于 `PageContainer`、页面标题、面包屑和页面级操作区的要求已被 ADR-0006 取代。当前项目统一使用 `BasicContainer` 与 `Scrollbar` 承载业务页面内容；本 PRD 的其余导航、主题和响应式设计决策继续有效。

## Problem Statement

当前企业级 React 项目模板已具备登录会话、工作台标签、用户管理和请求状态管理等基础能力，但页面导航信息分散在不同展示位置，页面标题与全局顶栏耦合，标准业务页缺少一致的页级结构；窄屏下侧栏会占满页面。开发者希望学习 React 版 Ant Design Pro 的企业后台设计方法，同时明确继续使用 Ant Design 核心组件，而不引入 Vue 项目设计或过早引入 ProComponents。

## Solution

将项目升级为以 Ant Design 核心组件为基础的企业后台页面基础设施。使用单一页面元数据注册表驱动菜单、路由、工作台标签、页面标题和面包屑；提供项目自有的轻量 `PageContainer`，统一标准业务页的页头、面包屑、操作区和内容间距。顶栏仅承载应用级操作，桌面端保留可折叠侧栏与工作台标签，窄屏端改为抽屉导航。通过 `ConfigProvider` 管理后台主题 token，并将首页、用户管理和字典管理占位页迁移到新规范。

## User Stories

1. As a 后台用户, I want to see a consistent page title and breadcrumb on standard business pages, so that I can understand my current location.
2. As a 后台用户, I want page-level actions such as 新增用户 to appear beside page information, so that I can find relevant actions without scanning the entire content area.
3. As a 后台用户, I want the global header to focus on application-wide controls, so that page-specific information is not duplicated.
4. As a 后台用户, I want the sidebar menu, page title, breadcrumb, and 工作台标签 to remain consistent for a page, so that navigation never disagrees with page context.
5. As a 后台用户, I want to retain opened 工作台标签 and close non-home pages, so that I can switch efficiently between visited work areas.
6. As a 移动端后台用户, I want navigation to open in a drawer and close after choosing a page, so that content remains usable on a narrow screen.
7. As a 后台用户, I want the overview home page to retain a focused dashboard presentation without a redundant page header, so that overview content has sufficient visual priority.
8. As a 后台用户, I want standard business pages such as 用户管理 and 系统字典 to use the same page shell, so that the application feels coherent.
9. As a 用户管理使用者, I want existing query, create, edit, and delete capabilities to keep working after the visual and layout migration, so that the upgrade does not interrupt user management.
10. As a 项目开发者, I want one page registration to define its navigation structure, so that adding a new page does not require manually synchronizing several layout locations.
11. As a 项目开发者, I want to pass page actions from the business page at runtime, so that actions can depend on page state, permissions, and event handlers without global coupling.
12. As a 项目开发者, I want Ant Design components to share the same enterprise theme automatically, so that component styling does not need repeated local overrides.
13. As a 项目开发者, I want Tailwind CSS to remain available for layout and non-component styling, so that existing layout productivity is preserved.
14. As a 学习者, I want 系统字典 to remain a lightweight placeholder rather than a generated CRUD example, so that I can independently practice applying the new page conventions later.

## Implementation Decisions

- 以 React 版 Ant Design Pro 的信息架构、页面规范和工程分层为参考；不参考或迁移任何 Vue 项目的设计与实现。
- 保持 Ant Design 核心组件为唯一 UI 基座。优先沉淀项目自有的轻量业务组件；仅在未来明确、稳定地减少重复代码时再单独评估引入 `@ant-design/pro-components`。
- 扩展现有工作台页面注册表，使其成为页面导航结构的唯一来源。每个页面声明稳定标识、路径、标题、菜单归属、面包屑信息与页面类型；由此生成路由、菜单、工作台标签、页面标题和面包屑。
- 区分概览页和标准业务页。概览页获得统一内容边距但默认隐藏 `PageContainer` 页头；标准业务页默认显示标题与面包屑。
- 新增轻量 `PageContainer`。它从当前页面元数据读取结构信息，并接受运行时 `extra` 插槽承载业务操作；不在全局元数据中放置具体按钮或事件处理器。
- 顶栏仅承载折叠控制、移动端导航触发、全局操作和用户菜单；页面级标题与面包屑由内容区 `PageContainer` 承载。
- 保留桌面端可折叠侧栏和工作台标签。首页标签不可关闭，其他已访问页面可关闭，导航关系继续由页面注册表驱动。
- 使用响应式断点切换导航表现：桌面端为固定侧栏，窄屏端为抽屉侧栏；移动端选择菜单项后自动关闭抽屉。
- 在应用级 Provider 中配置 Ant Design `ConfigProvider` 主题 token，统一企业绿色主题、文字、背景和圆角等组件视觉；Tailwind CSS 继续负责布局和少量组件库外样式。
- 迁移首页、用户管理和系统字典占位页到新页面结构。用户管理保留现有数据访问、查询、新增、编辑和删除行为；系统字典不实现真实 CRUD。
- 本阶段保持现有登录会话与路由守卫，不实现 RBAC、权限请求或基于角色的访问控制；页面元数据可保留未来授权扩展的位置，但不定义虚构权限语义。
- 遵守既有中文 JSDoc 与必要行内注释规范；新增或修改的公开组件、函数和复杂逻辑须同步维护中文注释。

## Testing Decisions

- 扩展现有工作台导航模块测试，验证页面元数据可一致地生成菜单、路由、标题、面包屑、工作台标签及页面类型；测试公开行为，不断言内部映射实现细节。
- 为 `PageContainer` 添加路由级渲染测试：标准业务页可见页头、面包屑和 `extra` 内容，概览页不渲染冗余页头。
- 为主布局添加交互测试：窄屏下可打开抽屉导航，选择菜单项后抽屉关闭；桌面端保留工作台标签打开、切换和关闭的既有行为。
- 保留并扩展用户管理页面交互测试，确保迁移后查询、新增、编辑和删除等外部可见行为不回退。
- 将现有工作台导航测试和用户管理页面测试作为测试先例；优先在路由和页面渲染边界验证功能，避免为内部状态拆分新增仅供测试使用的接口。
- 验收须通过类型检查、单元测试和生产构建。

## Out of Scope

- 引入 `@ant-design/pro-components`、ProTable、ProLayout 或其它 ProComponents 依赖。
- 深色模式、动态主题切换或主题设置面板。
- RBAC、角色权限、菜单权限、按钮权限或任何没有真实后端契约支撑的授权模型。
- 系统字典的真实 CRUD、数据接口或业务规则；该页面保留给开发者后续自行练习。
- 在仅有一个完整列表页面时抽象 `ListPage`、`CrudPage` 或通用 CRUD 生成器。
- 改造登录接口、会话协议、用户 API、请求封装和 TanStack Query 数据模型。

## Further Notes

- 此 PRD 遵循“以路由元数据驱动页面结构”“Ant Design 核心组件优先”和“ConfigProvider 管理后台主题”的既有架构决策。
- 工作台标签是后台工作台中表示一次已访问页面、支持切换和关闭的导航单元；首页工作台标签始终保留。
- 所有用户可见文案、代码注释和后续项目文档默认使用简体中文。
