# Design tokens

Portico UI uses a lintel / threshold visual language: rails and lintels, ink and stone, with indigo as the only saturated accent. Appearance is controlled with CSS custom properties. The default is a complete light theme. Add `html.pt-dark` or `[data-pt-theme="dark"]` for the complete dark skin.

## Overrides

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

Enable dark mode:

```html
<html class="pt-dark">
<!-- or -->
<div data-pt-theme="dark">...</div>
```

Motion honors `prefers-reduced-motion: reduce`. The font stack is led by Noto Sans SC, and the default transition is `--pt-ease` (`180ms ease`). Buttons, form labels, table headers, and tab and menu labels use Medium (500). Titles use `--pt-text-color` and body copy uses `--pt-text-regular`, with stronger contrast than a typical admin kit.

## Geometry and lintels

- Controls (button, input, select, tag, pagination item, checkbox, input-number stepper) use `--pt-radius-s` (2px).
- Larger surfaces (card, dialog, drawer, dropdown, menu, date panel) use `--pt-radius` (4px). `--pt-radius-l` is also 4px.
- `--pt-radius-pill` (999) is kept as a token but is not used on buttons, pagination, tags, or the switch. Status dots and radios may stay circular.
- Control borders use `--pt-border-width-control` (2px). Large surfaces keep `--pt-border-width` (1px).
- Focus is a 2px primary border, optionally with a hard 0-blur square offset ring (`outline: 2px solid; outline-offset: 2px`). There is no soft glow.
- Filled primary buttons have a 3px left lintel (`--pt-lintel`) in `--pt-color-primary-ink`. Other filled chromatic buttons use that type's `-active` color. Text buttons have no border or lintel; hover uses a soft fill.
- Selected menu items, table rows, and select options: a 3px left rail plus primary-soft fill. Cards have a 2px top lintel in primary-ink; dialogs and drawers have a 4px top lintel in primary. Error inputs and destructive alerts use a 3px danger rail.

## Common tokens

| Token | Light / dark default | Role |
| --- | --- | --- |
| `--pt-color-primary` | `#3b7ddd` / `#5b9aee` | Primary |
| `--pt-color-primary-ink` | `#244f8f` / `#1e4a86` | Darker lintel indigo |
| `--pt-bg-page` | `#f3f1ec` / `#0d0e11` | Stone paper / deeper ink canvas |
| `--pt-bg` | `#ffffff` / `#181a1d` | Elevated surface |
| `--pt-border-color` | `#c3bdb3` / `#3c3a36` | Inkier default border |
| `--pt-text-color` | `#1a1814` / `#eeeae4` | Titles and emphasis |
| `--pt-text-regular` | `#4a453f` / `#c9c4bb` | Body text |
| `--pt-text-inverse` | `#ffffff` | Inverse text on filled buttons, solid tags, and badges |
| `--pt-radius-s` / `--pt-radius` / `--pt-radius-l` | `2px` / `4px` / `4px` | Control and surface radii |
| `--pt-border-width-control` | `2px` | Control border width |
| `--pt-lintel-s` / `--pt-lintel` / `--pt-lintel-l` | `2px` / `3px` / `4px` | Lintel / rail thickness |
| `--pt-switch-track` | `#c4bfb6` / `#5c5852` | Switch off track |
| `--pt-font-size-xl` / `--pt-font-size-xxl` | `20px` / `24px` | Title sizes |
| `--pt-z-tooltip` / `--pt-z-notification` | `2500` / `4500` | Tooltip and notification layers |
| `--pt-sidebar-width` | `232px` | Sidebar width (56px when collapsed) |
| `--pt-header-height` | `56px` | Header height |
| `--pt-form-label-width` | `96px` | Default form label width |
| `--pt-control-h` | `34px` | Default control height (small / large: 26 / 42) |
| `--pt-ease` | `180ms ease` | Motion |

See `src/styles/theme.css` for the full list. Values are original and not a pixel-accurate copy of another library.
