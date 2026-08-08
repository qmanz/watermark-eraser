/**
 * inference.worker.ts — AI 推理 Web Worker
 *
 * 在独立线程中执行 ONNX Runtime 推理，避免阻塞 UI 主线程。
 *
 * 通信协议：
 *   主线程 → Worker: { type: 'inference', imageData, maskData, modelType, requestId }
 *   Worker → 主线程:
 *     { type: 'progress', requestId, progress }  — 进度更新（5/10/20/55/65/80/95/100）
 *     { type: 'result', requestId, result: InferenceResult } — 推理完成
 *     { type: 'error', requestId, error } — 推理失败
 *
 * 注意：
 *   - Worker 中不能使用 React hooks
 *   - 图像数据通过 ImageData 传输（结构化克隆）
 *   - ONNX Runtime 在 Worker 中独立加载（不共享主线程的 window.ort）
 *
 * 当前状态：
 *   主应用使用 useInference.ts（主线程推理，通过 window.ort CDN），
 *   此 Worker 为将来的多线程推理方案预留。
 *   要启用 Worker 推理，需在 useInference.ts 中将 startInference 替换为 Worker 通信。
 */

import { downloadAndCache } from '../utils/model';

/** 缓存的 ONNX Runtime 引用 */
let ort: typeof import('onnxruntime-web');

/** 懒加载 ONNX Runtime（Worker 中通过动态 import） */
async function getOrt() {
  if (!ort) {
    ort = await import('onnxruntime-web');
  }
  return ort;
}

/** 模型配置 */
const MODEL_CONFIGS: Record<string, { cacheKey: string; inputSize: number }> = {
  LaMa: { cacheKey: 'lama-model-v1', inputSize: 512 },
  'MI-GAN': { cacheKey: 'migan-model-v1', inputSize: 512 },
};

/**
 * Worker 消息入口
 * 接收主线程的推理请求，异步执行后返回结果
 */
self.onmessage = async (e: MessageEvent) => {
  const { type, imageData, maskData, modelType, requestId } = e.data;

  if (type !== 'inference') return;

  try {
    // 步骤 1：确定模型配置
    self.postMessage({ type: 'progress', requestId, progress: 5 });
    const config = MODEL_CONFIGS[modelType];
    if (!config) {
      throw new Error(`Unknown model: ${modelType}`);
    }

    // 步骤 2：加载 ONNX Runtime
    self.postMessage({ type: 'progress', requestId, progress: 10 });
    const rt = await getOrt();
    self.postMessage({ type: 'progress', requestId, progress: 20 });

    // 步骤 3：下载/读取模型文件
    const modelBuffer = await downloadAndCache(
      'LaMa',
      (pct: number) => {
        self.postMessage({
          type: 'progress',
          requestId,
          progress: 20 + Math.round(pct * 0.3),
        });
      }
    );
    self.postMessage({ type: 'progress', requestId, progress: 55 });

    // 步骤 4：创建推理会话
    const session = await rt.InferenceSession.create(modelBuffer, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
    });
    self.postMessage({ type: 'progress', requestId, progress: 65 });

    const size = config.inputSize;

    // 步骤 5：图像预处理（缩放 + 归一化为张量）
    const imgTensor = imageToTensor(imageData, size);
    const maskTensor = maskToTensor(maskData, size);
    self.postMessage({ type: 'progress', requestId, progress: 80 });

    // 步骤 6：执行推理
    const feeds: Record<string, any> = {
      image: new rt.Tensor('float32', imgTensor, [1, 3, size, size]),
      mask: new rt.Tensor('float32', maskTensor, [1, 1, size, size]),
    };
    const results = await session.run(feeds);
    self.postMessage({ type: 'progress', requestId, progress: 95 });

    // 步骤 7：后处理（张量 → 像素数据）
    const output = results.output.data as Float32Array;
    const resultPixels = tensorToPixels(output, size);

    self.postMessage({
      type: 'result',
      requestId,
      progress: 100,
      result: {
        imageData: resultPixels,
        width: size,
        height: size,
      },
    });
  } catch (error) {
    self.postMessage({
      type: 'error',
      requestId,
      error: error instanceof Error ? error.message : '推理失败',
    });
  }
};

// ======== 张量转换 ========

/**
 * ImageData → CHW Float32 张量（Worker 版本，无需 Canvas API）
 * 使用最近邻采样缩放，避免创建 DOM Canvas（Worker 中无 DOM）
 */
function imageToTensor(imageData: ImageData, size: number): Float32Array {
  const tensor = new Float32Array(3 * size * size);
  const srcW = imageData.width;
  const srcH = imageData.height;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // 最近邻采样：从源图中选取最接近的像素
      const srcX = Math.floor((x / size) * srcW);
      const srcY = Math.floor((y / size) * srcH);
      const srcIdx = (srcY * srcW + srcX) * 4;
      const dstIdx = y * size + x;

      tensor[dstIdx] = imageData.data[srcIdx] / 255.0;
      tensor[size * size + dstIdx] = imageData.data[srcIdx + 1] / 255.0;
      tensor[2 * size * size + dstIdx] = imageData.data[srcIdx + 2] / 255.0;
    }
  }

  return tensor;
}

/**
 * 遮罩 ImageData → 单通道 Float32 张量
 */
function maskToTensor(maskData: ImageData, size: number): Float32Array {
  const tensor = new Float32Array(size * size);
  const srcW = maskData.width;
  const srcH = maskData.height;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const srcX = Math.floor((x / size) * srcW);
      const srcY = Math.floor((y / size) * srcH);
      const srcIdx = (srcY * srcW + srcX) * 4;
      tensor[y * size + x] = maskData.data[srcIdx] > 128 ? 1.0 : 0.0;
    }
  }

  return tensor;
}

/**
 * CHW Float32 张量 → 像素缓冲
 */
function tensorToPixels(
  tensor: Float32Array,
  size: number
): { data: Uint8ClampedArray; width: number; height: number } {
  const total = size * size;
  const data = new Uint8ClampedArray(total * 4);

  for (let i = 0; i < total; i++) {
    const d = i * 4;
    const clamp = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255);
    data[d] = clamp(tensor[i]);
    data[d + 1] = clamp(tensor[total + i]);
    data[d + 2] = clamp(tensor[2 * total + i]);
    data[d + 3] = 255;
  }

  return { data, width: size, height: size };
}