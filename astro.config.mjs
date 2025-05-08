import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import tailwind from '@astrojs/tailwind'
import { createPinia } from 'pinia'
import router from './src/router'  // tu instancia ya configurada

export default defineConfig({
  integrations: [
    vue({
      // plugins: [createPinia(), router],  // ← aquí inyectamos Pinia y Router
    }),
    tailwind(),
  ],
  srcDir: './src',
  build: { outDir: 'dist' },
  vite: {
    resolve: { alias: { '@': '/src' } },
  },
})
