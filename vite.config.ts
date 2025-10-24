import { defineConfig } from 'vite';

// Extra Vite configuration; when running Vite directly in dev,
// mirror Angular's proxy to backend services.
export default defineConfig({
  define: {
    global: 'window',
    'process.env': {},
  },
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        ws: false,
      },
      '/ws-chat': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
