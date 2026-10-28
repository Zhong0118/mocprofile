/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// `--mode fixtures` swaps in test fixtures for local component checks. Production builds always
// resolve @site-content to the confirmed content in src/content/index.ts.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@site-content': path.resolve(
        __dirname,
        mode === 'fixtures' ? './src/fixtures/content.ts' : './src/content/index.ts',
      ),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
}))
