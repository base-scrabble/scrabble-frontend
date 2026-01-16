import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function legalPagesPlugin() {
  return {
    name: 'legal-pages-dev',
    configureServer(server) {
      const publicDir = path.join(server.config.root, 'public')

      server.middlewares.use((req, res, next) => {
        const pathname = (req.url || '').split('?')[0]

        const fileName =
          pathname === '/terms' ? 'terms.html'
            : pathname === '/privacy' ? 'privacy.html'
              : null

        if (!fileName) return next()

        try {
          const filePath = path.join(publicDir, fileName)
          const html = fs.readFileSync(filePath, 'utf8')
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        } catch (err) {
          server.config.logger.error(`[legal-pages] Failed to read ${fileName}: ${err?.message || err}`)
          res.statusCode = 500
          res.end('Failed to load page')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), legalPagesPlugin()],
  server: {
    host: true, // allow LAN + localhost
    port: 5173, // keep default port
    strictPort: true, // do not auto-shift ports
    open: true, // auto open browser when you run npm run dev
    // Proxy API calls in development to avoid CORS issues
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 60000, // 60 second timeout for API calls
      },
      // Proxy socket.io to backend so polling and websocket upgrades are forwarded
      '/socket.io': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 0, // No timeout for socket.io (long-polling support)
        rewrite: (path) => path.replace(/^\/socket.io/, '/socket.io'),
      },
    },
  }
 
})
