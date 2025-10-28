import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['ethers', '@fhevm-sdk'],
    exclude: ['*.sol']
  },
  server: {
    port: 3000,
    host: true
  },
  assetsInclude: ['**/*.sol']
})