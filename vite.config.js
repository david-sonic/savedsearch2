import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  publicDir: 'public',
  base: process.env.NODE_ENV === 'production' 
    ? '/saved-search-11-29-25/saved-search/' 
    : '/',
  server: {
    port: 3000,
    open: true,
    host: true,
    strictPort: false
  }
})
