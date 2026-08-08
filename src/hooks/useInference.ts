/**
 * useInference.ts — AI 推理 Hook
 *
 * 管理 ONNX Runtime 推理的完整生命周期：
 * 1. 从 window.ort（CDN 加载）获取推理引擎
 * 2. 下载 AI 模型文件
 * 3. 创建推理会话并执行
 * 4. 管理推理进度和错误状态
 *
 * 为什么用 window.ort 而非 import('onnxruntime-web')？
 *   import() 会导致 Vite 打包 27MB WASM 文件，路径解析在 dev 模式下不可靠，
 *   容易造成 WASM 加载失败 → JS 上下文崩溃 → 页面白屏。
 *   CDN <script> 标签加载完全绕开 Vite 的打包管线。
 */

import { useState, useCallback } from 'react';
import { ONNX_WASM_PATH, INFERENCE_SIZE, OUTPUT_SCALE_THRESHOLD } from '@/constants';
import {
  imageToTensor,
  maskToTensor,
  tensorToImageData,
  resizeImageData,
  minOf,
  maxOf,
  meanOf,
} from '@/utils/tensor';

interface InferenceState {
  progress: number;
  status: 'idle' | 'loading' | 'inferring' | 'done' | 'error';
  error: string | null;
}

/** 声明 CDN 加载的全局 ONNX Runtime */
declare global {
  interface Window {
    ort: typeof import('onnxruntime-web');
  }
}

export function useInference() {
  const [state, setState] = useState<InferenceState>({
    progress: 0,
    status: 'idle',
    error: null,
  });

  /**
   * 启动推理
   * @param imageData 原图 ImageData
   * @param maskData  遮罩 ImageData
   * @param _modelType 模型名称（当前固定 LaMa）
   * @returns 修复后的 ImageData
   */
  const startInference = useCallback(
    async (
      imageData: ImageData,
      maskData: ImageData,
      _modelType: string
    ): Promise<ImageData> => {
      setState({ progress: 0, status: 'inferring', error: null });

      try {
        const result = await runRealInference(imageData, maskData, (p) => {
          setState((s) => ({ ...s, progress: p }));
        });

        setState({ progress: 100, status: 'done', error: null });
        return result;
      } catch (err: any) {
        const msg = err?.message || err?.toString() || '推理失败';
        console.error('[Inference] Error:', err);
        setState({ progress: 0, status: 'error', error: msg });
        throw new Error(msg);
      }
    },
    []
  );

  return {
    ...state,
    startInference,
  };
}

// ======== 真实 ONNX 推理实现 ========

async function runRealInference(
  imageData: ImageData,
  maskData: ImageData,
  onProgress: (p: number) => void
): Promise<ImageData> {
  onProgress(5);

  const ort = window.ort;
  if (!ort) {
    throw new Error('ONNX Runtime 未加载，请刷新页面重试');
  }

  if (ort.env?.wasm) {
    ort.env.wasm.wasmPaths = ONNX_WASM_PATH;
  }

  onProgress(15);

  const { downloadAndCache } = await import('@/utils/model');
  onProgress(20);

  let modelBuffer: ArrayBuffer;
  try {
    modelBuffer = await downloadAndCache(
      'LaMa',
      (pct: number) => onProgress(20 + Math.round(pct * 0.3))
    );
  } catch (e: any) {
    throw new Error(`模型下载失败: ${e?.message || e}`);
  }

  console.log('[Inference] Model buffer size:', (modelBuffer.byteLength / 1024 / 1024).toFixed(1), 'MB');

  onProgress(55);

  let session: any;
  try {
    session = await ort.InferenceSession.create(modelBuffer, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
    });
  } catch (e: any) {
    throw new Error(`模型加载失败: ${e?.message || e}`);
  }

  console.log('[Inference] Session input names:', session.inputNames);
  console.log('[Inference] Session output names:', session.outputNames);

  onProgress(65);

  const size = INFERENCE_SIZE;
  const imgTensor = imageToTensor(imageData, size);
  const maskTensor = maskToTensor(maskData, size);

  let maskCount = 0;
  for (let i = 0; i < maskTensor.length; i++) {
    if (maskTensor[i] > 0.5) maskCount++;
  }
  console.log('[Inference] Mask coverage:', maskCount, '/', maskTensor.length,
    '=', (maskCount / maskTensor.length * 100).toFixed(1) + '%');

  console.log('[Inference] Image tensor stats:',
    'min=', minOf(imgTensor).toFixed(3),
    'max=', maxOf(imgTensor).toFixed(3),
    'mean=', meanOf(imgTensor).toFixed(3));

  onProgress(80);

  let results: any;
  try {
    const inputImageName = session.inputNames[0];
    const inputMaskName = session.inputNames[1];

    const feeds: Record<string, any> = {
      [inputImageName]: new ort.Tensor('float32', imgTensor, [1, 3, size, size]),
      [inputMaskName]: new ort.Tensor('float32', maskTensor, [1, 1, size, size]),
    };

    console.log('[Inference] Running with feeds:', Object.keys(feeds));
    results = await session.run(feeds);
    console.log('[Inference] Output keys:', Object.keys(results));
  } catch (e: any) {
    throw new Error(`模型推理失败: ${e?.message || e}`);
  }

  onProgress(95);

  const outputName = session.outputNames[0];
  const output = results[outputName].data as Float32Array;

  console.log('[Inference] Output tensor stats:',
    'min=', minOf(output).toFixed(3),
    'max=', maxOf(output).toFixed(3),
    'mean=', meanOf(output).toFixed(3),
    'shape:', results[outputName].dims);

  // 检测输出范围并归一化
  const outMax = maxOf(output);
  let normalized = output;
  if (outMax > OUTPUT_SCALE_THRESHOLD) {
    console.log('[Inference] Output scale detected as [0, 255], normalizing to [0, 1]');
    normalized = new Float32Array(output.length);
    for (let i = 0; i < output.length; i++) {
      normalized[i] = output[i] / 255.0;
    }
  }

  const resultData = tensorToImageData(normalized, size);
  const result = resizeImageData(resultData, size, size, imageData.width, imageData.height);

  onProgress(100);
  return result;
}