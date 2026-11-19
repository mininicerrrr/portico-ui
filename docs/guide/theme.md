# 设计变量

Portico UI 的视觉是「门廊 / 门槛」语言：门楣与轨、墨色与石色，靛蓝色是唯一高饱和强调色。外观由 CSS 自定义属性控制。默认是完整的亮色主题；在 `html.pt-dark` 或 `[data-pt-theme="dark"]` 下切换到完整暗色皮肤。

## 覆盖方式

```css
:root {
  --pt-color-primary: #2563eb;
  --pt-color-primary-hover: #3b82f6;
  --pt-color-primary-active: #1d4ed8;
  --pt-color-primary-soft: #eff6ff;
  --pt-color-primary-ink: #1e3a8a;
  --pt-radius-s: 2px;
  --pt-radius: 4px;
}
```

启用暗色：

```html
<html class="pt-dark">
<!-- 或 -->
<div data-pt-theme="dark">...</div>
```

动画遵循 `prefers-reduced-motion: reduce`。字体栈以 Noto Sans SC 为主，过渡时长为 `--pt-ease`（180ms ease）。按钮、表单标签、表头、页签与菜单文案使用 Medium（500）。标题使用 `--pt-text-color`，正文使用 `--pt-text-regular`，对比比一般后台皮肤更强。

## 几何与门楣

- 控件（按钮、输入、选择器、标签、分页项、复选框、数字输入步进器）圆角为 `--pt-radius-s`（2px）。
- 较大表面（卡片、对话框、抽屉、下拉、菜单、日期面板）圆角为 `--pt-radius`（4px）。`--pt-radius-l` 同样是 4px。
- `--pt-radius-pill`（999）保留，但不用于按钮、分页、标签或开关。状态圆点与单选仍可以是圆形。
- 控件描边为 `--pt-border-width-control`（2px）；卡片等大表面仍用 `--pt-border-width`（1px）。
- 焦点是 2px 主色描边，可叠加硬边 0 模糊的方正偏移环（`outline: 2px solid; outline-offset: 2px`），没有柔和外发光。
- 填充主色按钮左侧有 3px 门楣（`--pt-lintel`），颜色为 `--pt-color-primary-ink`。其它填充语义按钮用对应 `-active` 色。文字按钮没有描边和门楣，悬停为浅底。
- 选中的菜单项、表格行、选项：3px 左侧轨 + 主色浅底。卡片顶部 2px 墨色门楣；对话框与抽屉顶部 4px 主色门楣。错误输入与破坏性提示为 3px 危险色左轨。

## 常用令牌

| 变量 | 默认值（亮色 / 暗色） | 说明 |
| --- | --- | --- |
| `--pt-color-primary` | `#3b7ddd` / `#5b9aee` | 主色 |
| `--pt-color-primary-ink` | `#244f8f` / `#1e4a86` | 更深的门楣靛色 |
| `--pt-bg-page` | `#f3f1ec` / `#0d0e11` | 石色纸面 / 更深的墨色画布 |
| `--pt-bg` | `#ffffff` / `#181a1d` | 抬起的表面 |
| `--pt-border-color` | `#c3bdb3` / `#3c3a36` | 更偏墨色的默认描边 |
| `--pt-text-color` | `#1a1814` / `#eeeae4` | 标题与强调文字 |
| `--pt-text-regular` | `#4a453f` / `#c9c4bb` | 正文 |
| `--pt-text-inverse` | `#ffffff` | 填充按钮、实心标签与徽标上的反向文字 |
| `--pt-radius-s` / `--pt-radius` / `--pt-radius-l` | `2px` / `4px` / `4px` | 控件与表面圆角 |
| `--pt-border-width-control` | `2px` | 控件描边宽度 |
| `--pt-lintel-s` / `--pt-lintel` / `--pt-lintel-l` | `2px` / `3px` / `4px` | 门楣 / 轨厚度 |
| `--pt-switch-track` | `#c4bfb6` / `#5c5852` | 开关关闭轨道 |
| `--pt-font-size-xl` / `--pt-font-size-xxl` | `20px` / `24px` | 标题字号 |
| `--pt-z-tooltip` / `--pt-z-notification` | `2500` / `4500` | 提示与通知层级 |
| `--pt-sidebar-width` | `232px` | 侧栏宽度（折叠为 56px） |
| `--pt-header-height` | `56px` | 顶栏高度 |
| `--pt-form-label-width` | `96px` | 表单标签默认宽度 |
| `--pt-control-h` | `34px` | 默认控件高度（小/大：26 / 42） |
| `--pt-ease` | `180ms ease` | 默认过渡 |

完整列表见源码 `src/styles/theme.css`。主色及相关语义色接近常见中文后台界面习惯，但门楣几何、石色纸面与墨色文字均为独立设定。
