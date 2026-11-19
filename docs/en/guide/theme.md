# Design tokens

Portico UI is themed with CSS custom properties. The default appearance is a complete light theme. Add `html.pt-dark` or `[data-pt-theme="dark"]` for the complete dark skin, including semantic colors, focus rings, shadows, the switch track, and inverse text.

## Overrides

```css
:root {
  --pt-color-primary: #2563eb;
  --pt-color-primary-hover: #3b82f6;
  --pt-color-primary-active: #1d4ed8;
  --pt-color-primary-soft: #eff6ff;
  --pt-radius: 8px;
}
```

Enable dark mode:

```html
<html class="pt-dark">
<!-- or -->
<div data-pt-theme="dark">...</div>
```

Motion honors `prefers-reduced-motion: reduce`. The font stack is led by Noto Sans SC, and the default transition is `--pt-ease` (`180ms ease`).

## Common tokens

| Token | Light default | Role |
| --- | --- | --- |
| `--pt-color-primary` | `#3b7ddd` | Primary |
| `--pt-text-inverse` | `#ffffff` | Inverse text on filled buttons, solid tags, and badges |
| `--pt-switch-track` | `#c5ccd4` / dark `#5c6570` | Switch off track |
| `--pt-font-size-xl` / `--pt-font-size-xxl` | `20px` / `24px` | Title sizes |
| `--pt-z-tooltip` / `--pt-z-notification` | `2500` / `4500` | Tooltip and notification layers |
| `--pt-sidebar-width` | `232px` | Sidebar width (56px when collapsed) |
| `--pt-header-height` | `56px` | Header height |
| `--pt-form-label-width` | `96px` | Default form label width |
| `--pt-control-h` | `34px` | Control height |
| `--pt-ease` | `180ms ease` | Motion |

See `src/styles/theme.css` for the full list. Values are original and not a pixel-accurate copy of another library.
