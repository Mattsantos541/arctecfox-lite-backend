import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),   // ← runs Tailwind’s JIT first
    react(),         // ← then React HMR/etc.
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // your Replit or local host settings:
    allowedHosts: ['b4e41ee1-2b38-4726-b238-4a8f797ea7df-00-29exdnoe4vtox.worf.replit.dev'],
    hmr: {
      protocol: 'wss',
      host: 'b4e41ee1-2b38-4726-b238-4a8f797ea7df-00-29exdnoe4vtox.worf.replit.dev',
      clientPort: 443,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
