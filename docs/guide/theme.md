# 设计变量

Portico UI 的视觉通过 CSS 自定义属性控制。默认以亮色主题为主；暗色变量已预留在 `html.pt-dark` 与 `[data-pt-theme="dark"]` 下，便于后续扩展，但当前并不是一套完整的暗色皮肤。

## 覆盖方式

在全局样式中覆盖变量即可：

```css
:root {
  --pt-color-primary: #2563eb;
  --pt-color-primary-hover: #3b82f6;
  --pt-color-primary-active: #1d4ed8;
  --pt-color-primary-soft: #eff6ff;
  --pt-radius: 8px;
}
```

## 常用令牌

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--pt-color-primary` | `#3b7ddd` | 主色 |
| `--pt-color-success` | `#2f9e5c` | 成功 |
| `--pt-color-warning` | `#d89a2a` | 警告 |
| `--pt-color-danger` | `#e05353` | 危险 |
| `--pt-color-info` | `#7a8390` | 信息 |
| `--pt-text-color` | `#1f2a37` | 主文本 |
| `--pt-text-regular` | `#4b5563` | 常规文本 |
| `--pt-text-placeholder` | `#9ca3af` | 占位文本 |
| `--pt-border-color` | `#d7dde5` | 边框 |
| `--pt-bg` | `#ffffff` | 表面背景 |
| `--pt-bg-page` | `#f5f7fa` | 页面背景 |
| `--pt-radius` | `6px` | 默认圆角 |
| `--pt-font-size` | `14px` | 默认字号 |
| `--pt-font-size-s` | `12px` | 辅助字号 |
| `--pt-font-size-l` | `16px` | 大号字号 |
| `--pt-space-2` | `8px` | 间距 8 |
| `--pt-space-4` | `16px` | 间距 16 |
| `--pt-control-h` | `34px` | 默认控件高度 |
| `--pt-control-h-s` | `26px` | 小型控件高度 |
| `--pt-control-h-l` | `42px` | 大型控件高度 |

完整列表见源码 `src/styles/theme.css`。主色及相关语义色接近常见中文后台界面习惯，但配色、圆角与字号均为独立设定，并非对某一现有组件库的像素级复制。
