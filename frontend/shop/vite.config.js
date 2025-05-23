import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),svgr()],
  server: {
    host: '0.0.0.0', // 외부에서 접근할 수 있도록 설정
    port: 5173,       // 사용할 포트 (기본값 5173)
  },
})
