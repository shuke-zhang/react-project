# 企业级 React 项目模板

这是一个用于承载真实业务开发的企业级 React 项目模板，使用 React、Vite、TypeScript、Ant Design、axios、zod、TanStack Query 和 react-router-dom。

## 功能

- 真实 Blade 登录接口接入
- 登录态缓存与路由守卫
- 企业后台主布局
- REST 风格用户 CRUD 示例
- axios 请求封装
- zod 接口数据校验
- TanStack Query 服务端数据状态管理
- 页面统一放在 `src/views`
- 工具模块统一放在 `src/utils`

## 常用命令

```bash
pnpm install
pnpm dev
pnpm type-check
pnpm test:unit
pnpm build
```

## 默认登录

登录接口沿用当前项目的 Blade OAuth 接口。开发服务默认将 `/api` 代理到 `VITE_API_PROXY_TARGET`，未配置时为 `http://127.0.0.1:9922`。

## 目录约定

```text
src/
  api/        接口模块
  app/        应用级 Provider
  layouts/    后台布局
  mocks/      本地 mock 数据
  router/     路由与守卫
  types/      业务类型
  utils/      请求、缓存、校验等工具
  views/      页面
```
