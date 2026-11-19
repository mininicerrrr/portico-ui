import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'portico-ui': resolve(import.meta.dirname, 'src/index.ts')
    }
  },
  test: {
    environment: 'jsdom',
    globals: false,
    css: true,
    restoreMocks: true,
    setupFiles: ['./tests/setup.ts']
  }
})
