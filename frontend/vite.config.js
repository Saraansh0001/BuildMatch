import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        // XAMPP serves on port 80 — change "antig" if your htdocs folder is named differently
        target: 'http://localhost/antig/backend/api',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})