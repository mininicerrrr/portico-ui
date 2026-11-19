# 设计变量

Portico UI 的视觉通过 CSS 自定义属性控制。默认是完整的亮色主题；在 `html.pt-dark` 或 `[data-pt-theme="dark"]` 下会切换到完整暗色皮肤（含语义色、环、阴影、开关轨道和反向文本）。

## 覆盖方式

```css
:root {
  --pt-color-primary: #2563eb;
  --pt-color-primary-hover: #3b82f6;
  --pt-color-primary-active: #1d4ed8;
  --pt-color-primary-soft: #eff6ff;
  --pt-radius: 8px;
}
```

启用暗色：

```html
<html class="pt-dark">
<!-- 或 -->
<div data-pt-theme="dark">...</div>
```

动画遵循 `prefers-reduced-motion: reduce`。字体栈以 Noto Sans SC 为主，过渡时长为 `--pt-ease`（180ms ease）。

## 常用令牌

| 变量 | 默认值（亮色） | 说明 |
| --- | --- | --- |
| `--pt-color-primary` | `#3b7ddd` | 主色 |
| `--pt-text-inverse` | `#ffffff` | 填充按钮、实心标签与徽标上的反向文字 |
| `--pt-switch-track` | `#c5ccd4` / 暗色 `#5c6570` | 开关关闭轨道 |
| `--pt-font-size-xl` / `--pt-font-size-xxl` | `20px` / `24px` | 标题字号 |
| `--pt-z-tooltip` / `--pt-z-notification` | `2500` / `4500` | 提示与通知层级 |
| `--pt-sidebar-width` | `232px` | 侧栏宽度（折叠为 56px） |
| `--pt-header-height` | `56px` | 顶栏高度 |
| `--pt-form-label-width` | `96px` | 表单标签默认宽度 |
| `--pt-control-h` | `34px` | 默认控件高度 |
| `--pt-ease` | `180ms ease` | 默认过渡 |

完整列表见源码 `src/styles/theme.css`。主色及相关语义色接近常见中文后台界面习惯，但配色、圆角与字号均为独立设定。
