/**
 * tensor.ts — 张量转换工具（单一真相来源）
 *
 * 统一的图像 ↔ ONNX 张量 转换函数，所有模块从此导入。
 *
 * 格式约定：
 *   - ImageData:     HWC RGBA [0,255] — 浏览器原生像素格式
 *   - Image tensor:  CHW RGB  [0,1]   — 3 × N 的 Float32Array
 *   - Mask tensor:   1 × N  [0 or 1]  — 单通道二值 Float32Array
 *
 * 两个版本：
 *   DOM 版本 → 使用 Canvas API（双线性插值缩放），主线程使用
 *   Worker 版本 → 纯 JS 最近邻采样，无 DOM 依赖，Web Worker 使用
 */

import { INFERENCE_SIZE, MASK_THRESHOLD } from '@/constants';

// ======== DOM 版本（主线程使用 Canvas 双线性插值） ========

/**
 * 图像 ImageData → CHW Float32 张量
 *
 * 流程：putImageData → drawImage(resize) → getImageData → 逐通道填入 → /255 归一化
 * Canvas drawImage 内置双线性插值，缩放质量优于最近邻。
 */
export function imageToTensor(
  imageData: ImageData,
  size: number = INFERENCE_SIZE
): Float32Array {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas 2d context');

  const src = document.createElement('canvas');
  src.width = imageData.width;
  src.height = imageData.height;
  const srcCtx = src.getContext('2d');
  if (!srcCtx) throw new Error('Cannot get canvas 2d context');
  srcCtx.putImageData(imageData, 0, 0);

  ctx.drawImage(src, 0, 0, size, size);
  const pixels = ctx.getImageData(0, 0, size, size).data;

  const tensor = new Float32Array(3 * size * size);
  const total = size * size;
  for (let i = 0; i < total; i++) {
    const s = i * 4;
    tensor[i] = pixels[s] / 255.0;
    tensor[total + i] = pixels[s + 1] / 255.0;
    tensor[2 * total + i] = pixels[s + 2] / 255.0;
  }
  return tensor;
}

/**
 * 遮罩 ImageData → 单通道 Float32 张量
 *
 * 阈值判定：R > MASK_THRESHOLD → 1.0（需修复），否则 → 0.0（保留原图）
 */
export function maskToTensor(
  maskData: ImageData,
  size: number = INFERENCE_SIZE
): Float32Array {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas 2d context');

  const src = document.createElement('canvas');
  src.width = maskData.width;
  src.height = maskData.height;
  const srcCtx = src.getContext('2d');
  if (!srcCtx) throw new Error('Cannot get canvas 2d context');
  srcCtx.putImageData(maskData, 0, 0);

  ctx.drawImage(src, 0, 0, size, size);
  const pixels = ctx.getImageData(0, 0, size, size).data;

  const tensor = new Float32Array(size * size);
  for (let i = 0; i < size * size; i++) {
    tensor[i] = pixels[i * 4] > MASK_THRESHOLD ? 1.0 : 0.0;
  }
  return tensor;
}

/**
 * CHW Float32 张量 → ImageData
 *
 * 值范围 [0, 1] → [0, 255]，含 clamp 防浮点误差越界。
 */
export function tensorToImageData(
  tensor: Float32Array,
  size: number,
  alpha: number = 255
): ImageData {
  const imageData = new ImageData(size, size);
  const total = size * size;
  const clamp = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255);

  for (let i = 0; i < total; i++) {
    const d = i * 4;
    imageData.data[d] = clamp(tensor[i]);
    imageData.data[d + 1] = clamp(tensor[total + i]);
    imageData.data[d + 2] = clamp(tensor[2 * total + i]);
    imageData.data[d + 3] = alpha;
  }
  return imageData;
}

/**
 * ImageData 尺寸缩放（Canvas drawImage 双线性插值）
 */
export function resizeImageData(
  src: ImageData,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number
): ImageData {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = srcW;
  tempCanvas.height = srcH;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('Cannot get canvas 2d context');
  tempCtx.putImageData(src, 0, 0);

  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = dstW;
  resultCanvas.height = dstH;
  const resultCtx = resultCanvas.getContext('2d');
  if (!resultCtx) throw new Error('Cannot get canvas 2d context');
  resultCtx.drawImage(tempCanvas, 0, 0, dstW, dstH);

  return resultCtx.getImageData(0, 0, dstW, dstH);
}

// ======== Worker 版本（纯 JS，无 DOM 依赖） ========

/**
 * 图像 ImageData → CHW Float32 张量（最近邻采样）
 *
 * Worker 中不能使用 Canvas API，因此用纯 JS 最近邻采样替代。
 * 精度略低于双线性插值，但在 512×512 尺度下差异可忽略。
 */
export function imageToTensorNN(
  imageData: ImageData,
  size: number = INFERENCE_SIZE
): Float32Array {
  const tensor = new Float32Array(3 * size * size);
  const srcW = imageData.width;
  const srcH = imageData.height;
  const total = size * size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const srcX = Math.floor((x / size) * srcW);
      const srcY = Math.floor((y / size) * srcH);
      const srcIdx = (srcY * srcW + srcX) * 4;
      const dstIdx = y * size + x;

      tensor[dstIdx] = imageData.data[srcIdx] / 255.0;
      tensor[total + dstIdx] = imageData.data[srcIdx + 1] / 255.0;
      tensor[2 * total + dstIdx] = imageData.data[srcIdx + 2] / 255.0;
    }
  }
  return tensor;
}

/**
 * 遮罩 ImageData → 单通道 Float32 张量（最近邻采样）
 */
export function maskToTensorNN(
  maskData: ImageData,
  size: number = INFERENCE_SIZE
): Float32Array {
  const tensor = new Float32Array(size * size);
  const srcW = maskData.width;
  const srcH = maskData.height;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const srcX = Math.floor((x / size) * srcW);
      const srcY = Math.floor((y / size) * srcH);
      tensor[y * size + x] = maskData.data[(srcY * srcW + srcX) * 4] > MASK_THRESHOLD ? 1.0 : 0.0;
    }
  }
  return tensor;
}

/**
 * CHW Float32 张量 → Uint8ClampedArray 像素缓冲（Worker 版本）
 *
 * 返回裸缓冲而非 ImageData（后者在 Worker 中不可构造），
 * 由主线程收到结果后重建 ImageData。
 */
export function tensorToPixels(
  tensor: Float32Array,
  size: number
): { data: Uint8ClampedArray; width: number; height: number } {
  const total = size * size;
  const data = new Uint8ClampedArray(total * 4);
  const clamp = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255);

  for (let i = 0; i < total; i++) {
    const d = i * 4;
    data[d] = clamp(tensor[i]);
    data[d + 1] = clamp(tensor[total + i]);
    data[d + 2] = clamp(tensor[2 * total + i]);
    data[d + 3] = 255;
  }
  return { data, width: size, height: size };
}

// ======== 诊断辅助函数 ========

export function minOf(arr: Float32Array): number {
  let m = Infinity;
  for (let i = 0; i < arr.length; i++) if (arr[i] < m) m = arr[i];
  return m;
}

export function maxOf(arr: Float32Array): number {
  let m = -Infinity;
  for (let i = 0; i < arr.length; i++) if (arr[i] > m) m = arr[i];
  return m;
}

export function meanOf(arr: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  return sum / arr.length;
}