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
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './test-results/coverage',
      include: ['**/*.ts'],
      exclude: [
        '**/*.spec.ts',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.cy.ts',
        'i18n.ts',
        'cypress/**/*.ts',
        '**/*.cy.component.ts',
        'src/app/test/**/*.ts',
        'node_modules',
        'src/app/plugins/**/*.ts',
        'src/app/App.vue',
        'src/app/main.ts',
        'src/app/router/routes.ts',
        'src/features/horse-game/routes.ts',
      ],
      thresholds: {
        branches: 80,
        lines: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
})
