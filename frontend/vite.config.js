import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000", // ✅ Backend URL inside Replit
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    // ✅ ADD THIS SECTION to allow Replit's public domain
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev" // ✅ ← Your Replit domain
    ],
  },
});
