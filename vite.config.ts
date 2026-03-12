import path from 'node:path'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

const PORT = 3333

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    tailwindcss(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
  ] as any,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['primevue'],
  },
  server: {
    host: '0.0.0.0',
    port: PORT,
  },
  preview: {
    port: PORT,
  },
})
