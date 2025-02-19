import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",  // ✅ Ensures Vite listens externally
    port: 443,        // ✅ Uses Replit’s exposed HTTPS port
    strictPort: true,
    cors: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev", // ✅ Manually added Replit host
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
