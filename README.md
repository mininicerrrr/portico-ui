# Portico UI

A compact Vue 3 component library for practical admin and form interfaces, in a lintel / threshold visual language (rails, stone paper, ink type). Components are typed, themeable with CSS variables, and documented with a local VitePress site.

English | [简体中文](./README.zh-CN.md)

## Highlights

- Vue 3 + Vite + TypeScript, built in library mode
- Plugin install (`app.use(PorticoUI)`) or on-demand imports
- CSS variable theme: primary, lintels, stone paper, semantic colors, 2px/4px radii, typography, and spacing
- Light theme by default, with a complete dark theme (`html.pt-dark` or `[data-pt-theme="dark"]`)
- Prefix: `Pt` (`PtButton`, `PtInput`, …)
- Package name: `portico-ui`

## Install

```bash
npm install portico-ui
```

```ts
import { createApp } from 'vue'
import PorticoUI from 'portico-ui'
import 'portico-ui/style.css'
import App from './App.vue'

createApp(App).use(PorticoUI).mount('#app')
```

On-demand:

```ts
import { PtButton, message } from 'portico-ui'
import 'portico-ui/style.css'
```

## Components

Form and data: `PtButton`, `PtInput`, `PtTextarea`, `PtInputNumber`, `PtSelect` / `PtOption`, `PtCheckbox` / `PtCheckboxGroup`, `PtRadio` / `PtRadioGroup`, `PtSwitch`, `PtForm` / `PtFormItem`, `PtDatePicker`, `PtUpload`, `PtTable`, `PtPagination`.

Feedback and overlays: `PtDialog`, `PtDrawer`, `message`, `notify`, `PtAlert`, `PtTooltip`, `PtPopconfirm`, `PtDropdown` / `PtDropdownItem`.

Display and navigation: `PtTag`, `PtBadge`, `PtCard`, `PtSpace`, `PtDivider`, `PtEmpty`, `PtSkeleton`, `PtBreadcrumb` / `PtBreadcrumbItem`, `PtTabs` / `PtTabPane`, `PtMenu` / `PtMenuItem` / `PtSubMenu`.

`PtConfigProvider` supplies locale (default `zh-CN`, with a shipped `en` pack).

## Theming and dark mode

Import `portico-ui/style.css` once. Override CSS variables on `:root` or `.pt-theme`. Enable the dark skin with `html.pt-dark` or `[data-pt-theme="dark"]`.

## Internationalization

```ts
import PorticoUI, { en, zhCN } from 'portico-ui'

createApp(App).use(PorticoUI, { locale: zhCN }).mount('#app')
// or wrap a subtree:
// <pt-config-provider :locale="en">...</pt-config-provider>
```

## Local development

```bash
npm install
npm test              # unit tests
npm run build         # library build (JS, CSS, typings)
npm run docs:dev      # documentation site
npm run docs:build    # documentation build (base: /portico-ui/)
```

`npm run docs` is an alias of `docs:dev`.

The documentation site is configured for GitHub Pages at `/portico-ui/`. A workflow is included in `.github/workflows/pages.yml`.

## Design notes

The visual language is inspired by practical Chinese admin and form UIs, including the general look of Element Plus. Portico UI is an independent, original implementation. It does not copy source code, SVG icon sets, documentation text, or trademarks from Element Plus, Element, or Ant Design, and it does not wrap `element-plus`.

There is no official relationship with Element Plus, Element, or Ant Design.

## License

MIT
