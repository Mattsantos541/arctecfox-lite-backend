import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PUBLIC_HOST =
  'b4e41ee1-2b38-4726-b238-4a8f797ea7df-00-29exdnoe4vtox.worf.replit.dev' // Your Replit URL

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [PUBLIC_HOST],
    hmr: {
      protocol: 'wss',   // Use a secure WebSocket for Hot Module Reloading
      host: PUBLIC_HOST, // Use the public domain for HMR
      clientPort: 443    // Use port 443 if you access via HTTPS (80 for HTTP)
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        secure: false
        // Note: there is no rewrite – we keep the /api prefix intact.
      }
    }
  }
})
