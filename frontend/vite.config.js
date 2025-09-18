import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    open: false,
    proxy: {
      '/api': {
        target: 'https://invoice.mahsites.net/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../public',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          if (/\.(png|jpe?g|gif|svg)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`
          }
          // if (/print\.css$/.test(assetInfo.name)) {
          //   return `assets/styles/[name]-[hash][extname]`
          // }
          return `assets/[name]-[hash][extname]`
        }
      }
    }
  },
  base: '/',
})
