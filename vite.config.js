import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-quill']
  },
  build: {
    commonjsOptions: {
      include: [/react-quill/, /node_modules/]
    },
    // Split vendor chunks to allow parallel loading and better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — tiny, always needed
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Heavy animation library only loaded when needed
          'vendor-motion': ['framer-motion'],
          // Icons library
          'vendor-icons': ['react-icons'],
          // Rich text editor — admin only, very large
          'vendor-quill': ['react-quill'],
        }
      }
    },
    // Stronger minification
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'es2018',
    // Split CSS per chunk
    cssCodeSplit: true,
    // Warn on large chunks (useful for future monitoring)
    chunkSizeWarningLimit: 500,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
        },
        timeout: 0,
        proxyTimeout: 0
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
