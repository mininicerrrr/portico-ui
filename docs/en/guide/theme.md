# Design tokens

Portico UI uses **Clear rhythm (visual v2)**: 1px neutral borders, 6px control radius, action blue, and quiet hierarchy—without lintels, left rails, or thick decorative borders. Appearance is controlled with CSS custom properties. The default is a complete light theme; add `html.pt-dark` or `[data-pt-theme="dark"]` for the dark skin.

## Overrides

```css
:root {
  --pt-color-primary: #3473ce;
  --pt-color-primary-hover: #2f69bd;
  --pt-color-primary-active: #275aa3;
  --pt-radius-s: 6px;
  --pt-border-width-control: 1px;
}
```

Dark mode:

```html
<html class="pt-dark">
<!-- or -->
<div data-pt-theme="dark">...</div>
```

The docs site loads **Noto Sans SC 400/500** from Google Fonts. The library declares `--pt-font-family`; the host or docs must supply the webfont. Motion respects `prefers-reduced-motion: reduce`; transitions use `--pt-ease` (180ms ease).

## Geometry and states

- Controls use `--pt-radius-s` (**6px**); checkboxes `--pt-radius-xs` (3px); pagination `--pt-radius-pagination` (5px).
- Larger surfaces may use `--pt-radius-l` (8px). **12px** is for some presentation wrappers only, not every card default.
- Control borders are **1px**. Keyboard focus is **1px primary edge + 3px pale ring** (`--pt-color-focus-ring`), not a soft shadow.
- Filled primary buttons have no left lintel; default buttons are neutral outlines; text buttons use soft gray hover/press fills.
- Table hover uses `--pt-bg-row-hover`; selection uses `--pt-bg-row-selected`—distinct from each other, no left rail.
- Errors use border + icon/copy; dark error keeps dark fill with `#F18B8B` border/helper and `#4A2B35` focus ring.
- Disabled states use explicit fill/border/text colors; **no global opacity dimming**.

See the full token list in `src/styles/theme.css`. Live v2 verification: [Visual v2 verification](/en/guide/visual-v2).