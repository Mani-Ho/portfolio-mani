import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

// Grab the latest commit hash, fallback to "dev" if not in a git repo
let buildHash = 'dev';
try {
  buildHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch {
  // no git available, keep "dev"
}

const buildDate = new Date().toISOString().slice(0, 10);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    __BUILD_HASH__: JSON.stringify(buildHash),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
});
