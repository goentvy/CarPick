import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
// 현재 실행 환경(development, production 등)에 맞는 .env 파일을 로드합니다.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            proxy: {
                // 프론트엔드에서 /api로 시작하는 모든 요청을 가로챕니다.
                '/api': {
                // .env에 VITE_API_URL이 없으면 원격 서버를 기본값으로 사용합니다.
                    target: mode === 'development'
                        ? 'http://localhost:8080' // ✅ 로컬 Spring Boot
                        : env.VITE_API_URL || 'http://3.236.8.244', // ✅ AWS API 서버 (포트 80)
                    changeOrigin: true,
                    secure: false,
                // 백엔드 주소가 http://localhost:8080/api/notice 형식이므로
                // 경로를 건드리지 않고 그대로 전달하는 것이 가장 안전합니다.
                    rewrite: (path) => path,
                }
            }
        }
    }
})

