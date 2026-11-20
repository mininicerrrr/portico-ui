# Portico UI

面向后台与表单场景的小型 Vue 3 组件库，采用 **清晰秩序（visual v2）**：1px 描边、6px 圆角、行动蓝与安静层级（无门楣/色轨）。组件带有类型定义，可通过 CSS 变量定制主题，并配有可本地运行的 VitePress 文档站。

[English](./README.md) | 简体中文

## 访问地址

| 资源 | 地址 |
| --- | --- |
| 文档站（GitHub Pages） | [https://mininicerrrr.github.io/portico-ui/](https://mininicerrrr.github.io/portico-ui/) |
| npm 包 | [https://www.npmjs.com/package/portico-ui](https://www.npmjs.com/package/portico-ui) |
| 相关示例应用 | [https://mininicerrrr.github.io/portico-admin/](https://mininicerrrr.github.io/portico-admin/) |

## 特性

- Vue 3 + Vite + TypeScript，库模式构建
- 支持插件全量注册（`app.use(PorticoUI)`）与按需引入
- CSS 变量主题：行动蓝 `#3473CE`、中性描边、行悬停/选中、语义色，以及 6px 控件圆角、字号与间距
- 默认亮色，并提供完整暗色主题（`html.pt-dark` 或 `[data-pt-theme="dark"]`）
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

表单与数据：`PtButton`、`PtInput`、`PtTextarea`、`PtInputNumber`、`PtSelect` / `PtOption`、`PtCheckbox` / `PtCheckboxGroup`、`PtRadio` / `PtRadioGroup`、`PtSwitch`、`PtForm` / `PtFormItem`、`PtDatePicker`、`PtUpload`、`PtTable`、`PtPagination`。

反馈与浮层：`PtDialog`、`PtDrawer`、`message`、`notify`、`PtAlert`、`PtTooltip`、`PtPopconfirm`、`PtDropdown` / `PtDropdownItem`。

展示与导航：`PtTag`、`PtBadge`、`PtCard`、`PtSpace`、`PtDivider`、`PtEmpty`、`PtSkeleton`、`PtBreadcrumb` / `PtBreadcrumbItem`、`PtTabs` / `PtTabPane`、`PtMenu` / `PtMenuItem` / `PtSubMenu`。

`PtConfigProvider` 用于注入语言包（默认 `zh-CN`，同时提供 `en`）。

## 主题与暗色

引入一次 `portico-ui/style.css`。可在 `:root` 或 `.pt-theme` 上覆盖 CSS 变量。通过 `html.pt-dark` 或 `[data-pt-theme="dark"]` 启用暗色皮肤。

## 国际化

```ts
import PorticoUI, { en, zhCN } from 'portico-ui'

createApp(App).use(PorticoUI, { locale: zhCN }).mount('#app')
// 或局部包裹：
// <pt-config-provider :locale="en">...</pt-config-provider>
```

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
