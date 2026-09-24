# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

- 基于 Vue 2 + vue-router 的静态单页应用，用来聚合多个小游戏/工具。
- 使用 webpack 3 的自定义构建配置（由旧版 vue-cli webpack 模板生成），未使用 Vue CLI 3+。
- 没有单元测试/端到端测试框架，也没有状态管理库。

## 常用命令

- `npm install`：安装依赖。
- `npm run dev`（或 `npm start`）：启动 webpack-dev-server，默认地址 `localhost:8080`，会自动打开浏览器。
- `npm run build`：生产构建，输出到 `dist/`，静态资源使用相对路径 `./`。
- `npm run build --report`：构建完成后打开 webpack bundle analyzer（依赖 `npm_config_report`）。
- `npm run lint`：对 `src/` 下的 `.js` 和 `.vue` 文件运行 ESLint，规则见 `.eslintrc.js`。
- 项目没有 `test` 脚本，因此不存在“运行单个测试”的命令。

## 应用架构

- 入口：`src/main.js`。挂载 Vue 根实例，引入 ElementUI、jquery、全局工具 `src/util/util.js`（通过 `this.$u` 访问）和请求封装 `src/api/index.js`（通过 `this.$api` 访问）。
- 路由：`src/router/index.js`。每个小游戏/工具对应一个路由，组件按 `src/components/<name>/<name>.vue` 组织；除首页菜单外全部使用异步加载。
- 路由 `meta`：
  - `mouseRightMenu`：是否允许浏览器右键菜单。
  - `mouseSelect`：是否允许文本选择。
  - 两者在 `router.afterEach` 中统一设置到 `document`。
- 菜单：`src/components/gameMenu.vue`。维护游戏列表，点击后通过 `window.open` 在新标签页打开对应路由。
- 组件结构：每个游戏组件基本自包含，模板、scoped SCSS、脚本、静态资源（图片、数据文件）放在同一目录下。复杂游戏（如 `gangCompany`、`magicCube`）会拆分子组件和 `db/` 数据文件。
- 构建配置：
  - `build/webpack.base.conf.js`：入口、resolve alias `@ -> src`、ProvidePlugin 自动注入 `jQuery`/`$`、CommonsChunkPlugin 提取 `common.js`。
  - `config/index.js`：开发与生产的服务器、路径、source map 配置。
  - `build/webpack.base.conf.js` 中的 ESLint loader 已被注释掉，因此开发编译时不会实时检查；请使用 `npm run lint`。
  - `.eslintrc.js` 使用 `plugin:vue/essential` + JavaScript Standard Style，`no-debugger` 在生产构建时报错。

## 主要依赖

- UI：`element-ui`
- 3D：`three`（用于 `magicCube`、`gangEditor` 等）
- 图表：`echarts`
- 其他：`axios`、`clipboard`、`dat.gui`、`js-base64`、`openai`、`stats-js`、`jquery`

## README 要点

- 本地开发：`npm install` -> `npm run dev`。
- 线上部署地址：https://lucky131.github.io/GamesPage/
- 作者：-3-（杠三杠）