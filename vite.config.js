import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port:5173, // default dev port
    open: true // auto open browser when you run npm run dev 
  }
 
})
