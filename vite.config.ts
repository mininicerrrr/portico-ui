import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      rollupTypes: true,
      insertTypesEntry: true,
      cleanVueFileName: true,
      async afterBuild() {
        execSync('node scripts/patch-published-dts.mjs', {
          cwd: resolve(import.meta.dirname),
          stdio: 'inherit'
        })
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'PorticoUI',
      fileName: (format) => {
        if (format === 'es') return 'portico-ui.es.js'
        if (format === 'cjs') return 'portico-ui.cjs'
        return 'portico-ui.umd.js'
      },
      formats: ['es', 'cjs', 'umd'],
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named'
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true
  }
})
