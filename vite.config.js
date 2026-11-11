import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// 同一份源码、两套部署目标：
//   npm run build           -> base '/'，用于阿里云服务器（deploy/deploy.sh）
//   npm run build:ghpages   -> base '/dev-portfolio/'，用于 GitHub Pages
export default defineConfig(({ mode }) => ({
  base: mode === 'ghpages' ? '/dev-portfolio/' : '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
}));
