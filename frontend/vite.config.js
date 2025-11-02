import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'disable-host-check',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          req.headers.host = 'localhost'
          next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          // Ignorer la vérification du host
          next()
        })
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/socket.io': {
        target: process.env.VITE_SOCKET_URL || 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
    strictPort: false
  }
})