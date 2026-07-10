# 应用主题 token 接入

**类型：** AFK  
**标签：** `ready-for-agent`

## What to build

在应用级上下文中接入 Ant Design `ConfigProvider`，将既有企业绿色视觉沉淀为组件主题 token。现有页面继续使用 Tailwind CSS 处理布局与少量组件库之外的样式，使按钮、表格、表单和弹窗在不重复局部覆写的前提下保持一致。

## Acceptance criteria

- [ ] Ant Design 组件从同一组应用主题 token 获取主色、文字、背景和圆角等视觉配置。
- [ ] 既有首页、用户管理、登录和主布局在主题接入后仍可正常渲染与交互。
- [ ] Tailwind CSS 继续承担布局和组件库外样式，不引入动态换肤或深色模式。
- [ ] 新增或修改的公开代码具备符合仓库规范的中文 JSDoc。
- [ ] 类型检查、单元测试和生产构建通过。

## Blocked by

None - can start immediately.
