import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  envDir: resolve(__dirname, '..'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  preview: {
    port: parseInt(process.env.VITE_DEV_PORT || '5173'),
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  server: {
    host: true,
    port: parseInt(process.env.VITE_DEV_PORT || '5173'),
    allowedHosts: ["172.26.1.65", "staging-stockhub.pm2etml.ch"],
  },
});

// export default defineConfig({
//   // ...
//   preview: {
//     host: true,
//     port: parseInt(process.env.VITE_DEV_PORT || '5173'),
//     allowedHosts: ["172.26.1.65", "staging-stockhub.pm2etml.ch"],
//     proxy: {
//       '/api': {
//         target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
//         changeOrigin: true,
//       },
//     },
//   },
//   server: {
//     host: true,
//     port: parseInt(process.env.VITE_DEV_PORT || '5173'),
//     allowedHosts: ["172.26.1.65", "staging-stockhub.pm2etml.ch"],
//   },
// });