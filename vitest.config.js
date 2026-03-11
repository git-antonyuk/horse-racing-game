import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['primevue'],
  },
  plugins: [vue(), tailwindcss(), analyzer()],
  test: {
    reporters: ['default'],
    passWithNoTests: true,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/vitest.setup.ts'],
    coverage: {
      reporter: ['json', 'html'],
      reportsDirectory: './test-results/coverage',
      include: ['**/*.ts', '**/*.vue'],
      exclude: [
        '**/*.spec.ts',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.cy.ts',
        'i18n.ts',
        'cypress/**/*.ts',
        '**/*.cy.component.ts',
        'src/test/**/*.ts',
        'node_modules',
        'src/plugins/**/*.ts',
        'src/App.vue',
        'src/main.ts',
      ],
      thresholds: {
        branches: 90,
        lines: 90,
        functions: 90,
        statements: 90,
      },
    },
  },
})
