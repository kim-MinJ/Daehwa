// frontend/vite.config.ts  (또는 vite.config.js)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    fs: { strict: true } // 프로젝트 밖 경로 import 차단
  }
});
