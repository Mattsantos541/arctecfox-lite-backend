import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PUBLIC_HOST =
  'b4e41ee1-2b38-4726-b238-4a8f797ea7df-00-29exdnoe4vtox.worf.replit.dev' // 👈  your repl URL

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [PUBLIC_HOST],
    hmr: {
      protocol: 'wss',   // secure websocket
      host: PUBLIC_HOST, // point to the outside‑facing host
      clientPort: 443    // 80 if you access via http
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        secure: false,
        rewrite: p => p.replace(/^\/api/, '')
      }
    }
  }
})
