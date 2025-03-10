import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";  // ✅ Import path module

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),  // ✅ Add alias for @ to resolve to src/
    },
  },
  server: {
    host: "0.0.0.0",
    port: 443,
    strictPort: true,
    cors: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev",
      process.env.REPLIT_APP_URL || "localhost",
    ],
    proxy: {
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
