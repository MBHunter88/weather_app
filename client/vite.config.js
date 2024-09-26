import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/weather': 'http://localhost:8080', // Replace with your Express server's address
   '/search': 'http://localhost:8080', 
    },
  },
})
