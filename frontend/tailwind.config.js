/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // src 폴더 안 모든 파일에서 Tailwind 클래스 인식
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};