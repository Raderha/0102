import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://jobready-backend-282796839955.asia-northeast3.run.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path, // /api 경로 유지
      }
    }
  }
});


