import react from '@vitejs/plugin-react';
export default {
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev"
    ]
  }
};
