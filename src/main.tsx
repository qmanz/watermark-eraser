/**
 * main.tsx — 应用入口文件
 *
 * 职责：
 * 1. 挂载 React 应用到 DOM 的 #root 节点
 * 2. 引入全局样式（Tailwind + 自定义组件样式）
 * 3. 启用 React.StrictMode 进行开发期严格检查
 * 4. 包裹 I18nProvider 提供多语言支持
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider } from './i18n';
import App from './App';
import './styles/index.css';

// PWA Service Worker 注册
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
    console.log('[SW] 已注销旧 Service Worker，刷新后获取最新版本');
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);