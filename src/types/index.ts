/**
 * types/index.ts — 全局类型定义
 *
 * 集中管理整个项目的 TypeScript 类型，包括：
 * - 应用状态枚举（AppState）
 * - Canvas 画笔工具类型（ToolType）
 * - AI 模型类型（ModelType / ModelStatus）
 * - 遮罩历史记录（MaskHistory）
 * - AI 推理结果（InferenceResult）
 * - Web Worker 通信协议（WorkerRequest / WorkerResponse）
 * - 上传图片数据结构（UploadedImage）
 */

// ---- Canvas 画笔工具 ----

/** 画笔工具类型：brush=画笔涂抹 / eraser=橡皮擦 / rectangle=矩形选区 */
export type ToolType = 'brush' | 'eraser' | 'rectangle';

// ---- AI 模型 ----

/** 可选 AI 模型（当前仅 LaMa） */
export type ModelType = 'LaMa';

/** 模型加载状态 */
export type ModelStatus = 'unloaded' | 'downloading' | 'ready' | 'error';

// ---- 应用状态机 ----

/**
 * 应用主状态流转：
 * idle → loading → editing → inferring → done
 * idle → loading → editing → error
 * done → editing（允许重新涂抹再推理）
 * 任意状态 → idle（重置）
 */
export type AppState = 'idle' | 'loading' | 'editing' | 'inferring' | 'done' | 'error';

// ---- 遮罩历史（撤销功能） ----

/** 单个历史快照，保存遮罩层某一时刻的完整像素数据 */
export interface MaskHistory {
  imageData: ImageData;
  timestamp: number;
}

// ---- AI 推理结果 ----

/** 推理产生的去水印结果 */
export interface InferenceResult {
  imageData: ImageData;
  width: number;
  height: number;
}

// ---- Web Worker 通信协议 ----

/** 主线程 → Worker 的推理请求 */
export interface WorkerRequest {
  type: 'inference';
  imageData: ImageData;
  maskData: ImageData;
  modelType: ModelType;
  requestId: string;
}

/** Worker → 主线程的响应（进度 / 结果 / 错误） */
export interface WorkerResponse {
  type: 'progress' | 'result' | 'error';
  requestId: string;
  progress?: number;
  result?: InferenceResult;
  error?: string;
}

// ---- 上传图片数据结构 ----

/** 用户上传图片的完整信息，包含 File 对象、data URL、Image 元素及原始尺寸 */
export interface UploadedImage {
  file: File;
  dataUrl: string;
  image: HTMLImageElement;
  width: number;
  height: number;
}