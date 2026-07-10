import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = command === 'serve' || mode === 'development'
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:9922'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      open: false,
      port: 88,
      proxy: isDev
        ? {
            '/api': {
              target: apiProxyTarget,
              changeOrigin: true,
              rewrite: path => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
      css: true,
      testTimeout: 15000,
    },
  }
})
