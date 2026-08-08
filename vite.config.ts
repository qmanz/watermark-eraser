import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'WatermarkEraser - AI 水印擦除',
        short_name: 'WatermarkEraser',
        description: '基于 AI 的本地水印擦除工具，保护隐私',
        theme_color: '#534AB7',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 60 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,svg,png,wasm,onnx}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  worker: {
    format: 'es',
  },
  // onnxruntime-web is loaded from CDN, not bundled
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['onnxruntime-web'],
    },
  },
});