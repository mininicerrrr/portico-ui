# Changelog

## 0.1.2 (unreleased)

### Compatibility

- **Node `require('portico-ui')`**: `exports.require` now resolves to `dist/portico-ui.cjs` (`.cjs` extension). With `"type": "module"`, `.js` UMD was interpreted as ESM under Node and `require` returned an empty module (`undefined.defineComponent` / missing exports).
- **TypeScript consumers**: published `dist/index.d.ts` is generated against **`vue-dts-baseline` (Vue 3.4.38)** via `tsconfig.dts.json`, then `patch-published-dts.mjs` normalizes imports to `vue`. No `declare module 'vue'` / index signature ships in the tarball.
- `unpkg` points at the browser UMD build; `main` is the CJS entry for tooling that reads `main`.
- **Vue peer range:** `^3.4.0` — strict consumer matrix covers **3.4.0 / 3.4.21 / 3.4.38 / 3.5.22 / 3.5.45** with TS 5.9.3 and `skipLibCheck: false`. Library dev/runtime still builds with Vue 3.5.x.

## 0.1.1

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