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
    proxy: {
      '/api': 'http://localhost:8080', // Spring Boot 서버 주소
    },
    port: 5173,
    open: true, // 서버 시작 시 브라우저 자동 열기
  },
});