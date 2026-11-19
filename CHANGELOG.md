# Changelog

## 0.1.2 (unreleased)

### Compatibility

- **Node `require('portico-ui')`**: `exports.require` now resolves to `dist/portico-ui.cjs` (`.cjs` extension). With `"type": "module"`, `.js` UMD was interpreted as ESM under Node and `require` returned an empty module (`undefined.defineComponent` / missing exports).
- **TypeScript consumers**: `patch-published-dts.mjs` replaces rolled `GlobalComponents` / `GlobalDirectives` imports with local `Record<>` type aliases in **published** `dist/index.d.ts` only. No `declare module 'vue'` (and no index signature) ships in the tarball — consumer `vue` namespace is not widened by the package.
- `unpkg` points at the browser UMD build; `main` is the CJS entry for tooling that reads `main`.
- **Vue peer range:** `^3.4.0` runtime (CJS/ESM checked at 3.4.38). Published `dist/index.d.ts` strict checks (TS 5.9.3, `skipLibCheck: false`) run against **Vue 3.5.22 / 3.5.45** (matches library build tooling).

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