# 以 Ant Design 核心组件构建后台组件体系

本项目以 React 版 Ant Design Pro 的信息架构、页面规范和工程分层作为学习参考，但不复用 Vue 项目 ruoyi-vue-pro 的设计或实现。界面始终以 Ant Design 核心组件为基础，并优先沉淀项目自有的轻量业务组件（例如页面容器）；`@ant-design/pro-components` 仅在某一明确场景能稳定减少重复代码时按需引入。这一选择避免将项目绑定到与既有路由、请求和状态模型不匹配的重型脚手架，同时保留日后采用 ProTable 等增强组件的空间。
