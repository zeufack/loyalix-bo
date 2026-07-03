import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.{ts,tsx}']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  },
  oxc: {
    // tsconfig.json sets jsx: "preserve" for Next.js's own SWC transform —
    // Vite's oxc transform needs to do its own JSX transform instead.
    jsx: { runtime: 'automatic' }
  }
});
