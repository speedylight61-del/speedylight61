import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://asucapstone.com:3000", // Backend server
        changeOrigin: true,
      },
    },
  },
});
