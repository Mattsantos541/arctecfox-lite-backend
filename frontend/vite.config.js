import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "b4e41ee1-2b38-4726-b238-4a8f797ea7df-00-29exdnoe4vtox.worf.replit.dev"
    ],
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false
      }
    }
  }
})
