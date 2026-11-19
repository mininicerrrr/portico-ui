# Portico UI

面向后台与表单场景的小型 Vue 3 组件库。组件带有类型定义，可通过 CSS 变量定制主题，并配有可本地运行的 VitePress 文档站。

[English](./README.md) | 简体中文

## 特性

- Vue 3 + Vite + TypeScript，库模式构建
- 支持插件全量注册（`app.use(PorticoUI)`）与按需引入
- CSS 变量主题：主色、成功、警告、危险、信息，以及圆角、字号与间距
- 默认亮色，并预留暗色变量
- 组件前缀：`Pt`（如 `PtButton`、`PtInput`）
- npm 包名：`portico-ui`

## 安装

```bash
npm install portico-ui
```

```ts
import { createApp } from 'vue'
import PorticoUI from 'portico-ui'
import 'portico-ui/style.css'
import App from './App.vue'

createApp(App).use(PorticoUI).mount('#app')
```

按需引入：

```ts
import { PtButton, message } from 'portico-ui'
import 'portico-ui/style.css'
```

## 组件

`PtButton`、`PtInput`、`PtSelect` / `PtOption`、`PtCheckbox` / `PtCheckboxGroup`、`PtRadio` / `PtRadioGroup`、`PtSwitch`、`PtForm` / `PtFormItem`、`PtDialog`、`message`、`PtTag`、`PtCard`、`PtSpace`、`PtDivider`、`PtTable`。

## 本地开发

```bash
npm install
npm test              # 单元测试
npm run build         # 构建组件库（JS、样式与类型）
npm run docs:dev      # 启动文档站
npm run docs:build    # 构建文档站（base 为 /portico-ui/）
```

`npm run docs` 是 `docs:dev` 的别名。

文档站已按 GitHub Pages 的 `/portico-ui/` 路径配置，工作流见 `.github/workflows/pages.yml`。

## 设计说明

视觉风格参考了常见的中文后台与表单界面，包括 Element Plus 一类产品的实用审美。Portico UI 是独立的原创实现，没有复制 Element Plus、Element 或 Ant Design 的源码、SVG 图标集、文档原文或商标，也不是对 `element-plus` 的套壳。

本项目与 Element Plus、Element、Ant Design 没有任何官方关联。

## 许可证

MIT
