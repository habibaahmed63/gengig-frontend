
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = (
    env.VITE_API_PROXY_TARGET ||
    env.VITE_API_URL ||
    'http://localhost:3000'
  ).replace(/\/+$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: proxyTarget.startsWith('https://'),
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
})
