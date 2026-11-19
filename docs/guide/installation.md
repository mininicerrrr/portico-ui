# 安装

Portico UI 是一个 Vue 3 组件库，需要 Vue 3.4 或更高版本。

## 使用包管理器

仓库发布到 npm 之后，可以通过以下方式安装：

```bash
npm install portico-ui
# 或
pnpm add portico-ui
# 或
yarn add portico-ui
```

当前源码也可以在本地通过路径依赖或直接复制 `src` / 构建产物使用。

## 引入样式

必须在应用入口引入样式文件，组件才会呈现完整外观：

```ts
import 'portico-ui/style.css'
```

## 浏览器支持

面向现代浏览器（最近两个版本的 Chrome、Firefox、Safari 与 Edge）。样式使用了 CSS 变量与少量较新的颜色函数，不包含旧版 IE 兼容代码。
