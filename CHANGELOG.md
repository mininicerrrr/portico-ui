# Changelog

## 0.1.1 (unreleased)

### Accessibility

- **Table** default overflow cells (`showOverflowTooltip` not `false`): full text is available on **keyboard focus** (Tab) when the cell is actually truncated, with **Escape** to dismiss the tooltip. Non-truncated cells do not receive a Tab stop.
- **PtTableEllipsisCell**: same keyboard path; set `showOverflowTooltip={false}` to disable overflow tooltip behavior (escape hatch).
- **Table** sortable column headers: **Enter** / **Space** toggle sort (including `sortable: 'custom'` emit path); `aria-sort` and visible `:focus-visible` ring on sortable headers only.
- **PtTooltip**: stable panel `id` via Vue `useId()`, `aria-describedby` on the trigger while open; optional `triggers` array (`hover` / `focus` / `click`). Legacy `trigger` prop remains supported.

### Docs / CI

- `docs:preview-smoke` runs built static docs + Playwright layout check (CI).
- Default `vitepress preview` with `base: /portico-ui/` is validated separately; known asset-path limitation is reported explicitly (static server smoke does not substitute for default preview).

## 0.1.0

Initial public API and Visual v2 styling.