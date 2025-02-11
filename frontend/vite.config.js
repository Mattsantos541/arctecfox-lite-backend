import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allows external connections
    port: 5173, // Keep this the same
    strictPort: true,
    cors: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".replit.dev", // Allow Replit domains
      "8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev" // Your Replit host
    ]
  }
});
