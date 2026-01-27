import { defineConfig } from 'vite'
import react from '@vitejs/react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})