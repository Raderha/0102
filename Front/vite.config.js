import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://jobready-backend-282796839955.asia-northeast3.run.app',
        changeOrigin: true,
        secure: false, // SSL 인증서 검증 비활성화 (개발 환경)
        rewrite: (path) => path, // /api 경로 유지
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📤 Sending Request:', req.method, req.url);
            console.log('   Target:', 'https://jobready-backend-282796839955.asia-northeast3.run.app' + req.url);
            // 요청 본문이 있으면 로깅 (POST 요청의 경우)
            if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk.toString();
              });
              req.on('end', () => {
                if (body) {
                  try {
                    const parsed = JSON.parse(body);
                    console.log('   Body:', JSON.stringify(parsed, null, 2));
                  } catch (e) {
                    console.log('   Body (raw):', body);
                  }
                }
              });
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📥 Received Response:', proxyRes.statusCode, req.url);
            if (proxyRes.statusCode >= 400) {
              console.log('   ⚠️ Error response status:', proxyRes.statusCode);
            }
            // 응답 본문 로깅 (GET 요청의 경우)
            if (req.method === 'GET' && proxyRes.statusCode === 200) {
              let body = '';
              proxyRes.on('data', (chunk) => {
                body += chunk.toString();
              });
              proxyRes.on('end', () => {
                if (body) {
                  try {
                    const parsed = JSON.parse(body);
                    console.log('   Response Body:', JSON.stringify(parsed, null, 2));
                  } catch (e) {
                    console.log('   Response Body (raw):', body.substring(0, 200));
                  }
                }
              });
            }
          });
        },
      }
    }
  }
}); 