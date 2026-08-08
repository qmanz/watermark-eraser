/**
 * vite-env.d.ts — Vite 环境类型声明
 *
 * 为 Vite 特有的模块导入方式提供 TypeScript 类型支持：
 * - Vite 客户端类型引用（HMR API、import.meta.env 等）
 * - CSS Module 导入声明（*.module.css）
 * - Worker 文件导入声明（*.worker?worker）
 */

/// <reference types="vite/client" />

// 允许 TypeScript 识别 CSS Module 导入
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 允许 TypeScript 识别 Vite 的 Web Worker 导入语法
// 使用方式：import Worker from './foo.worker?worker'
declare module '*.worker?worker' {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}