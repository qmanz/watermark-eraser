/**
 * main.tsx — 应用入口文件
 *
 * 职责：
 * 1. 挂载 React 应用到 DOM 的 #root 节点
 * 2. 引入全局样式（Tailwind + 自定义组件样式）
 * 3. 启用 React.StrictMode 进行开发期严格检查
 *
 * 注意：ONNX Runtime 的 CDN 脚本在 index.html 中通过 <script> 标签加载，
 * 挂载到 window.ort，避免 Vite 打包 27MB WASM 导致的崩溃问题
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// PWA Service Worker 注册：检测到新版本时自动刷新，避免缓存旧代码
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    // 注销所有旧的 Service Worker，让下次加载获取最新版本
    regs.forEach((reg) => reg.unregister());
    console.log('[SW] 已注销旧 Service Worker，刷新后获取最新版本');
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);