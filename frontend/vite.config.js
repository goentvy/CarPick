import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 환경 변수 로드 (VITE_ 접두사가 붙은 것들을 로드합니다)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        // 로컬 개발 환경에서 /api 요청을 처리
        '/api': {
          target: env.VITE_API_URL || 'http://3.236.8.244:8080',
          changeOrigin: true,
          secure: false,
          // 주소 끝에 /api가 포함되어 전달되도록 설정
          rewrite: (path) => path, 
        }   
      }
    }
  }
})