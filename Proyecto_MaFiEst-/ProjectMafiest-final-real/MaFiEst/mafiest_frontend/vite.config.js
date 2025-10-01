import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración básica de Vite para React
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // tu backend
        changeOrigin: true,
      },
    },
  },
})
