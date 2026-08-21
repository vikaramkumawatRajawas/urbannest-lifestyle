import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Standard base path for Render Static Site SPA hosting
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'exposure-lottery-murphy-zus.trycloudflare.com',
      'flux-decision-warming-attract.trycloudflare.com',
      '.trycloudflare.com'
    ]
  }
})
