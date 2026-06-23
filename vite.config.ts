import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'argon2-browser': path.resolve(
        __dirname,
        'node_modules/argon2-browser/dist/argon2-bundled.min.js'
      ),
    },
  },
})
