import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow LAN + localhost
    port: 5173, // keep default port
    strictPort: true, // do not auto-shift ports
    open: true, // auto open browser when you run npm run dev
    // Proxy API calls in development to avoid CORS issues
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 60000, // 60 second timeout for API calls
      },
      // Proxy socket.io to backend so polling and websocket upgrades are forwarded
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 0, // No timeout for socket.io (long-polling support)
        rewrite: (path) => path.replace(/^\/socket.io/, '/socket.io'),
      },
    },
  }
 
})
