# Installation

Portico UI is a Vue 3 component library and requires Vue 3.4 or later.

## Package managers

After the package is published to npm:

```bash
npm install portico-ui
# or
pnpm add portico-ui
# or
yarn add portico-ui
```

The source in this repository can also be consumed locally via a path dependency or by using the build output.

## Styles

Import the stylesheet once at the application entry:

```ts
import 'portico-ui/style.css'
```

## Browser support

Modern evergreen browsers (the last two versions of Chrome, Firefox, Safari, and Edge). The styles rely on CSS variables and do not include legacy Internet Explorer fallbacks.
