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

// 创建 React 根节点并渲染应用
// StrictMode 仅在开发模式下启用，生产构建中自动剥离
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);