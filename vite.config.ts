import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      rollupTypes: true,
      insertTypesEntry: true,
      cleanVueFileName: true
    })
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'PorticoUI',
      fileName: (format) => `portico-ui.${format}.js`,
      formats: ['es', 'umd'],
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
