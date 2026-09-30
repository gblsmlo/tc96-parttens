import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: [
      '@base-ui/react/field',
      '@base-ui/react/form',
      '@base-ui/react/popover',
      '@base-ui/react/select',
      '@dnd-kit/dom/sortable',
    ],
  },
  plugins: [react(), tailwindcss()],
})
