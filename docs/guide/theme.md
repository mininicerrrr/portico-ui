# 设计变量

Portico UI 采用 **清晰秩序（visual v2）**：1px 中性描边、6px 控件圆角、靛蓝行动色与安静的层级，不再使用门楣/左侧色轨等厚重装饰。外观由 CSS 自定义属性控制。默认是完整的亮色主题；在 `html.pt-dark` 或 `[data-pt-theme="dark"]` 下切换到暗色皮肤。

## 覆盖方式

```css
:root {
  --pt-color-primary: #3473ce;
  --pt-color-primary-hover: #2f69bd;
  --pt-color-primary-active: #275aa3;
  --pt-color-primary-soft: #edf4ff;
  --pt-radius-s: 6px;
  --pt-border-width-control: 1px;
}
```

启用暗色：

```html
<html class="pt-dark">
<!-- 或 -->
<div data-pt-theme="dark">...</div>
```

文档站通过 Google Fonts 加载 **Noto Sans SC 400/500**。库内声明 `--pt-font-family`，由宿主或文档注入 Web 字体。动画遵循 `prefers-reduced-motion: reduce`，过渡为 `--pt-ease`（180ms ease）。

## 几何与状态

- 控件（按钮、输入、选择器等）圆角 `--pt-radius-s`（**6px**）；复选框圆角 `--pt-radius-xs`（3px）；分页项圆角 `--pt-radius-pagination`（5px）。
- 卡片等大表面可用 `--pt-radius-l`（8px）；**12px** 仅用于部分演示外框，并非所有卡片的默认圆角。
- 控件描边 `--pt-border-width-control`（**1px**）。键盘焦点为 **1px 主色边 + 3px 浅蓝环**（`--pt-color-focus-ring`），非模糊阴影。
- 填充主色按钮无左侧门楣；次要按钮为中性描边；文字按钮无框，悬停 `#F3F6FA` / 按下 `#E9EEF5`。
- 表格行悬停 `--pt-bg-row-hover`，选中 `--pt-bg-row-selected`；二者与主色浅底区分，无左侧轨。
- 错误：描边 + 图标/文案说明，无 3px 错误轨。暗色下错误保持深色底，描边/辅助文案 `#F18B8B`，焦点外环 `#4A2B35`。
- 禁用：亮色 `#F0F3F7` 底与 `#97A2B2` 字；暗色底 `#1B2533`、描边 `#344257`、文字 `#8291A5`，**不使用全局 opacity 衰减**。

## 常用令牌

| 变量 | 默认值（亮色 / 暗色） | 说明 |
| --- | --- | --- |
| `--pt-color-primary` | `#3473ce` / `#3473ce` | 行动蓝 |
| `--pt-color-primary-hover` | `#2f69bd` / `#4a8ae0` | 悬停 |
| `--pt-color-primary-active` | `#275aa3` / `#2f69bd` | 按下 |
| `--pt-bg-page` | `#f6f8fb` / `#111a27` | 页面底 |
| `--pt-bg` | `#ffffff` / `#1b2737` | 工作面 |
| `--pt-border-color` | `#d5dce6` / `#44536a` | 控件描边 |
| `--pt-text-color` | `#192638` / `#ecf1f9` | 标题 |
| `--pt-text-regular` | `#445369` / `#ccd6e5` | 正文 |
| `--pt-bg-row-hover` | `#f7f9fc` / `#1f2d40` | 表格悬停 |
| `--pt-bg-row-selected` | `#edf4ff` / `#203553` | 表格选中 |
| `--pt-color-focus-ring` | `#dae8fc` / `#253e60` | 焦点环 |
| `--pt-control-h` | `34px` | 默认控件高度（小/大：26 / 42） |
| `--pt-lintel` | `0px` | **已弃用**，保留名兼容 |

完整列表见 `src/styles/theme.css`。线上 v2 实装对照见 [Visual v2 验证](/guide/visual-v2)。