import { defineConfig } from 'vite'

export default defineConfig({
  base: '/GenPassword/',
  build: {
    outDir: 'dist'
  },
  server: {
    headers: {
      'X-XSS-Protection': '1; mode=block',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
})