/**
 * model.ts — AI 模型下载、缓存、推理
 *
 * 数据流：
 *   1. downloadAndCache → 从 hf-mirror.com 下载 ONNX 模型 → 缓存到 IndexedDB
 *   2. runInference → 加载模型 → 图像预处理 → ONNX 推理 → 后处理
 *
 * 当前仅支持 LaMa（Large Mask Inpainting）。
 */

import { LAMA_MODEL_URL, LAMA_CACHE_KEY, INFERENCE_SIZE } from '@/constants';
import { getCachedModel, cacheModel } from './storage';
import { imageToTensor, maskToTensor, tensorToImageData, resizeImageData } from './tensor';

/** 模型配置 */
const MODEL_CONFIGS = {
  LaMa: {
    url: LAMA_MODEL_URL,
    name: 'lama',
    inputSize: INFERENCE_SIZE,
    cacheKey: LAMA_CACHE_KEY,
  },
};

type ModelName = keyof typeof MODEL_CONFIGS;

/** 缓存 ONNX Runtime 的 import（Worker 场景使用） */
let cachedOrt: typeof import('onnxruntime-web') | null = null;

async function loadOrt() {
  if (!cachedOrt) {
    cachedOrt = await import('onnxruntime-web');
  }
  return cachedOrt;
}

/**
 * 下载 AI 模型并缓存到 IndexedDB
 *
 * 缓存策略：
 *   - 首次：从网络下载（~200MB）
 *   - 再次：从 IndexedDB 读取（毫秒级）
 */
export async function downloadAndCache(
  modelName: ModelName,
  onProgress?: (pct: number) => void
): Promise<ArrayBuffer> {
  const config = MODEL_CONFIGS[modelName];

  // 1. 尝试从 IndexedDB 读取缓存
  const cached = await getCachedModel(config.cacheKey);
  if (cached) {
    onProgress?.(100);
    return cached;
  }

  // 2. 从网络流式下载
  console.log('[Model] Downloading from:', config.url);
  const response = await fetch(config.url).catch((e) => {
    console.error('[Model] Fetch error:', e);
    throw new Error(`网络请求失败: ${e.message || e}`);
  });
  console.log('[Model] Response status:', response.status, 'url:', response.url);
  if (!response.ok) throw new Error(`模型下载失败: HTTP ${response.status}`);
  if (!response.body) throw new Error('浏览器不支持流式下载');

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total > 0 && onProgress) {
      onProgress(Math.round((received / total) * 100));
    }
  }

  // 3. 合并 chunk
  const buffer = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }

  // 4. 存入 IndexedDB
  await cacheModel(config.cacheKey, buffer.buffer.slice(0));
  onProgress?.(100);
  return buffer.buffer;
}

/**
 * 运行完整的 AI 推理流程（使用动态 import 的 ONNX Runtime）
 *
 * 注意：主应用优先使用 useInference.ts（window.ort CDN），
 * 此函数为 Worker 和其他场景提供备选。
 */
export async function runInference(
  modelName: ModelName,
  imageData: ImageData,
  maskData: ImageData,
  onProgress?: (pct: number) => void
): Promise<ImageData> {
  onProgress?.(10);

  const ort = await loadOrt();
  onProgress?.(20);

  const modelBuffer = await downloadAndCache(modelName, (pct) => {
    onProgress?.(20 + Math.round(pct * 0.3));
  });
  onProgress?.(55);

  const config = MODEL_CONFIGS[modelName];
  const size = config.inputSize;

  const session = await ort.InferenceSession.create(modelBuffer, {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
  });
  onProgress?.(65);

  const imgTensor = imageToTensor(imageData, size);
  const maskTensor = maskToTensor(maskData, size);
  onProgress?.(80);

  const inputNames = session.inputNames;
  const feeds: Record<string, any> = {
    [inputNames[0]]: new ort.Tensor('float32', imgTensor, [1, 3, size, size]),
    [inputNames[1]]: new ort.Tensor('float32', maskTensor, [1, 1, size, size]),
  };
  const results = await session.run(feeds);
  onProgress?.(95);

  const outputName = session.outputNames[0];
  const output = results[outputName].data as Float32Array;
  const resultData = tensorToImageData(output, size);
  const result = resizeImageData(resultData, size, size, imageData.width, imageData.height);
  onProgress?.(100);
  return result;
}