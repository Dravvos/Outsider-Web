import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({

  server: {
    proxy: {
      '/.well-known/openid-configuration': {
        target: process.env.VITE_API_IdentityServer, // New backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace('/.well-known/openid-configuration', '/'),
      }
    }
  },
  base: '/Outsider.Web',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
