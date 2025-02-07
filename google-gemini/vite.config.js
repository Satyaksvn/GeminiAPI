import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/GeminiAPI/', // Ensure this is set for GitHub Pages
  plugins: [react()],
})
