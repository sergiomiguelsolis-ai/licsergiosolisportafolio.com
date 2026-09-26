import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // proyects/ holds heavy source files (videos still being exported, PSDs…).
    // The site only uses the optimized copies in public/, so don't watch it.
    watch: { ignored: ['**/proyects/**'] },
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-')) return 'motion'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
