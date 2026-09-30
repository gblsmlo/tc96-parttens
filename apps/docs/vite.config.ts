import { defineConfig } from 'vite'
import mdx from 'fumadocs-mdx/vite'

export default defineConfig({
  plugins: [mdx()],
})
