import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('@microsoft/signalr')) {
            return 'signalr'
          }

          if (id.includes('@mui/icons-material')) {
            return 'mui-icons'
          }

          if (id.includes('@mui/x-date-pickers')) {
            return 'mui-pickers'
          }

          if (id.includes('@mui/') || id.includes('@emotion/')) {
            return 'mui-core'
          }

          if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor'
          }

          if (id.includes('recharts')) {
            return 'charts'
          }

          if (
            id.includes('@radix-ui/') ||
            id.includes('sonner') ||
            id.includes('zod') ||
            id.includes('axios') ||
            id.includes('dayjs') ||
            id.includes('lucide-react') ||
            id.includes('react-icons') ||
            id.includes('@react-oauth/google') ||
            id.includes('next-themes') ||
            id.includes('tailwind-merge') ||
            id.includes('class-variance-authority') ||
            id.includes('embla-carousel-react') ||
            id.includes('input-otp') ||
            id.includes('react-day-picker') ||
            id.includes('react-resizable-panels') ||
            id.includes('cmdk') ||
            id.includes('vaul')
          ) {
            return 'ui-utils'
          }

          return undefined
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5037',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
