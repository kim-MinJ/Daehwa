import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // src 경로 alias
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // 선택 사항
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
 server: {
    // ✅ 추가: /api 를 백엔드로 프록시
    proxy: {
      "/api": {

        target: "http://localhost:8080",


        changeOrigin: true,
      },
    },
    fs: { strict: true }, // 기존 코드 유지
  },
});
