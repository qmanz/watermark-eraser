/**
 * constants.ts — 全局常量配置
 *
 * 集中管理所有魔术数字、URL、阈值等硬编码值。
 * 修改一处即可全局生效，避免散落在各文件中导致不一致。
 */

// ======== AI 模型 ========

/** ONNX Runtime CDN 加载地址 */
export const ONNX_WASM_PATH = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/';

/** LaMa 模型下载地址（hf-mirror 镜像站） */
export const LAMA_MODEL_URL =
  'https://hf-mirror.com/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx';

/** LaMa 模型 IndexedDB 缓存键 */
export const LAMA_CACHE_KEY = 'lama-model-v1';

// ======== 推理参数 ========

/** 模型输入/输出尺寸（像素） */
export const INFERENCE_SIZE = 512;

/** 遮罩二值化阈值：红色通道 > 此值判定为"需要修复" */
export const MASK_THRESHOLD = 128;

/** 输出值范围检测阈值：max > 此值判定为 [0,255] 而非 [0,1] */
export const OUTPUT_SCALE_THRESHOLD = 1.5;

// ======== 图像处理 ========

/** 上传/显示图片的最大边长（像素），超出等比缩放 */
export const MAX_IMAGE_DIM = 2048;

/** 上传图片最大文件大小（字节） */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** 支持的图片格式 */
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp'];

// ======== Canvas 涂抹 ========

/** 画笔笔触宽度（像素） */
export const BRUSH_SIZE = 40;

/** 画笔颜色（红色，半透明） */
export const BRUSH_COLOR = 'rgba(255, 0, 0, 0.5)';

/** 橡皮擦笔触宽度（像素） */
export const ERASER_SIZE = 40;

/** 遮罩历史记录最大步数（用于撤销） */
export const MAX_MASK_HISTORY = 50;

// ======== 模型状态 UI ========

import type { ModelStatus } from '@/types';

export const MODEL_STATUS_CONFIG: Record<
  ModelStatus,
  { label: string; color: string; bgColor: string }
> = {
  unloaded: { label: '未加载', color: '#9CA3AF', bgColor: '#F9FAFB' },
  downloading: { label: '下载中', color: '#F59E0B', bgColor: '#FFFBEB' },
  ready: { label: '已就绪', color: '#10B981', bgColor: '#ECFDF5' },
  error: { label: '加载失败', color: '#EF4444', bgColor: '#FEF2F2' },
};