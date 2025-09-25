import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://user26614.requestly.tech',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/test/api'),
      },
    },
  },
})
