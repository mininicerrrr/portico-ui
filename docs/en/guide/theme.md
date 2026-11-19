# Design tokens

Portico UI is themed with CSS custom properties. The default appearance is a light theme. Dark tokens are reserved on `html.pt-dark` and `[data-pt-theme="dark"]` for later work; they are not a complete dark theme yet.

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

## Common tokens

| Token | Default | Role |
| --- | --- | --- |
| `--pt-color-primary` | `#3b7ddd` | Primary |
| `--pt-color-success` | `#2f9e5c` | Success |
| `--pt-color-warning` | `#d89a2a` | Warning |
| `--pt-color-danger` | `#e05353` | Danger |
| `--pt-color-info` | `#7a8390` | Info |
| `--pt-text-color` | `#1f2a37` | Primary text |
| `--pt-border-color` | `#d7dde5` | Border |
| `--pt-bg` | `#ffffff` | Surface |
| `--pt-bg-page` | `#f5f7fa` | Page background |
| `--pt-radius` | `6px` | Radius |
| `--pt-font-size` | `14px` | Font size |
| `--pt-control-h` | `34px` | Control height |

See `src/styles/theme.css` for the full list. The palette is close to familiar Chinese admin UI conventions, but the values are original and not a pixel-accurate copy of another library.
