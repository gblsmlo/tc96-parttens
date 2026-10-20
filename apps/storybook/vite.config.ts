import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: [
      '@base-ui/react/alert-dialog',
      '@base-ui/react/field',
      '@base-ui/react/form',
      '@base-ui/react/number-field',
      '@base-ui/react/popover',
      '@base-ui/react/radio',
      '@base-ui/react/radio-group',
      '@base-ui/react/select',
      '@base-ui/react/toggle',
      '@base-ui/react/toggle-group',
      '@dnd-kit/dom/sortable',
    ],
  },
  plugins: [react(), tailwindcss()],
})
