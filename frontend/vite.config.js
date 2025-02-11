import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Ensures external access
    port: 5173, // Default Vite port
    strictPort: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev" // Add your Replit host
    ],
    cors: true, // Enable CORS for external requests
  },
});
