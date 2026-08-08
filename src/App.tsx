/**
 * App.tsx — WatermarkEraser 主应用
 *
 * 应用状态流转（appState）：
 *   idle → editing → inferring → done
 *              ↑                    │
 *              └─── (推理失败) ──────┘
 *
 * 数据流向：
 *   用户上传图片 → useImageUpload.processFile() 解析文件
 *              → ImageEditor 绘制到 Canvas（原图 + 遮罩双层）
 *              → 用户在遮罩层涂抹水印区域（useCanvas）
 *              → 点击"开始擦除" → useInference.startInference() 调用 AI
 *              → 结果渲染到 Canvas → CompareView 对比预览 → 下载
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { AppState, ModelType, ModelStatus } from '@/types';
import Header from '@/components/Header';
import DropZone from '@/components/DropZone';
import ImageEditor from '@/components/ImageEditor';
import ToolPanel from '@/components/ToolPanel';
import ModelSelector from '@/components/ModelSelector';
import ProgressBar from '@/components/ProgressBar';
import CompareView from '@/components/CompareView';
import Toast from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useCanvas } from '@/hooks/useCanvas';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useInference } from '@/hooks/useInference';
import { canvasToBlob } from '@/utils/image';
import { downloadAndCache } from '@/utils/model';

export default function App() {
  // ==========================================================================
  // 状态定义
  // ==========================================================================

  /** 应用主状态：idle | editing | inferring | done */
  const [appState, setAppState] = useState<AppState>('idle');

  /** 当前选择的 AI 模型（目前仅 LaMa，后续可扩展） */
  const selectedModel: ModelType = 'LaMa';

  /** AI 模型的加载状态 */
  const [modelStatus, setModelStatus] = useState<ModelStatus>('unloaded');

  /** 模型下载进度 0-100 */
  const [modelProgress, setModelProgress] = useState(0);

  /** 全局 toast 消息提示 */
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  /** 当前使用的工具：brush（画笔）| eraser（橡皮擦）| rectangle（矩形选区） */
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser' | 'rectangle'>('brush');

  /** 画笔/橡皮擦大小（像素） */
  const [brushSize, setBrushSizeState] = useState(24);

  /** 遮罩层是否有涂抹内容（控制"开始擦除"按钮的禁用状态） */
  const [hasMask, setHasMask] = useState(false);

  /** 推理结果的 data URL，传给 CompareView 做对比预览 */
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);

  // ==========================================================================
  // 工具函数
  // ==========================================================================

  /** 显示 toast 提示 */
  const showToast = useCallback((message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  // ==========================================================================
  // 自定义 Hooks
  // ==========================================================================

  /**
   * useCanvas — Canvas 涂抹交互
   * 管理双层 Canvas（mainCanvasRef：原图，maskCanvasRef：遮罩）的鼠标事件
   * 返回画笔控制、撤销、遮罩数据读取等方法
   */
  const {
    mainCanvasRef,
    maskCanvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    setTool: setCanvasTool,
    setBrushSize: setCanvasBrushSize,
    undo,
    resetMask,
    getMaskData,
    getImageData,
    drawResult,
  } = useCanvas({
    onMaskChange: (hasMask: boolean) => setHasMask(hasMask),
  });

  /**
   * useImageUpload — 图片文件解析
   * 将用户上传的 File 转换为 HTMLImageElement + dataUrl + 尺寸信息
   * 注意：Canvas 绘制由 ImageEditor 组件负责，这里不操作 Canvas
   */
  const { image, error: uploadError, loading: uploading, processFile, reset: resetImage } = useImageUpload();

  /**
   * useInference — AI 推理引擎
   * 封装 ONNX Runtime（从 CDN 加载的 window.ort）的调用
   * 返回推理进度、状态和 startInference 方法
   */
  const { progress, error: inferError, startInference } = useInference();

  // ==========================================================================
  // 模型预加载（应用启动后自动检查/下载 ONNX 模型）
  // ==========================================================================

  /** 防止重复加载的标记 */
  const modelLoadingRef = useRef(false);

  useEffect(() => {
    if (modelLoadingRef.current) return;
    if (modelStatus === 'ready' || modelStatus === 'downloading') return;

    modelLoadingRef.current = true;

    preloadModel({
      onDownloading: () => {
        setModelStatus('downloading');
      },
      onProgress: (pct: number) => {
        setModelProgress(pct);
      },
      onReady: () => {
        setModelStatus('ready');
        modelLoadingRef.current = false;
      },
      onError: () => {
        setModelStatus('error');
        modelLoadingRef.current = false;
      },
    });
  }, [selectedModel]);

  /**
   * 预加载 AI 模型文件到 IndexedDB
   *
   * 模型加载是纯 I/O（下载/读缓存），不创建推理 session。
   * 推理 session 创建在 startInference 中按需完成。
   *
   * 承载模型状态更新回调，桥接 model.ts 和 App 层的 UI 状态。
   */
  async function preloadModel(
    callbacks: {
      onDownloading: () => void;
      onProgress: (pct: number) => void;
      onReady: () => void;
      onError: () => void;
    }
  ) {
    try {
      callbacks.onDownloading();
      await downloadAndCache('LaMa', callbacks.onProgress);
      callbacks.onReady();
    } catch (err) {
      console.error('[ModelPreload] Failed:', err);
      callbacks.onError();
    }
  }

  // ==========================================================================
  // 事件处理
  // ==========================================================================

  /**
   * 用户选择了图片文件
   * 1. 调用 processFile 解析文件内容
   * 2. 切换到编辑状态
   * 3. 清空之前的遮罩和结果
   */
  const handleFileSelect = useCallback(
    async (file: File) => {
      const result = await processFile(file);
      if (result) {
        setAppState('editing');
        resetMask();
        setResultDataUrl(null);
      }
    },
    [processFile, resetMask]
  );

  /**
   * 重置所有状态，回到初始页面
   * 清空图片、遮罩、结果，回到 idle 状态
   */
  const handleReset = useCallback(() => {
    resetImage();
    resetMask();
    setResultDataUrl(null);
    setAppState('idle');
    modelLoadingRef.current = false;
  }, [resetImage, resetMask]);

  /**
   * 切换涂抹工具（画笔 / 橡皮擦 / 矩形选区）
   * 同步更新 UI 状态和 useCanvas hook 中的工具
   */
  const handleToolChange = useCallback(
    (tool: 'brush' | 'eraser' | 'rectangle') => {
      setCurrentTool(tool);
      setCanvasTool(tool);
    },
    [setCanvasTool]
  );

  /**
   * 调整画笔/橡皮擦大小
   * 同步更新 UI 状态和 useCanvas hook 中的笔刷大小
   */
  const handleBrushSizeChange = useCallback(
    (size: number) => {
      setBrushSizeState(size);
      setCanvasBrushSize(size);
    },
    [setCanvasBrushSize]
  );

  /**
   * 执行 AI 水印擦除 — 核心功能
   *
   * 流程：
   * 1. 从 Canvas 获取原图和遮罩的 ImageData
   * 2. 校验遮罩是否有实际涂抹内容
   * 3. 切换到 inferring 状态，显示进度条
   * 4. 调用 startInference → ONNX Runtime 推理
   * 5. 将结果绘制回 Canvas，生成 dataUrl 用于对比预览
   * 6. 切换到 done 状态，显示对比视图
   *
   * 错误处理：
   * - 无遮罩 → toast 提示
   * - 推理失败 → 恢复到 editing 状态 + toast 报错
   */
  const handleErase = useCallback(async () => {
    // 第一步：获取原图和遮罩数据
    const imgData = getImageData();
    const maskData = getMaskData();

    if (!imgData || !maskData) {
      showToast('请先涂抹需要擦除的水印区域', 'error');
      return;
    }

    // 第二步：检查遮罩层是否有有效内容（红色通道 > 128 或 alpha > 0）
    const maskPixels = maskData.data;
    let hasAnyMask = false;
    for (let i = 0; i < maskPixels.length; i += 4) {
      if (maskPixels[i] > 128 || maskPixels[i + 3] > 0) {
        hasAnyMask = true;
        break;
      }
    }

    if (!hasAnyMask) {
      showToast('请先涂抹需要擦除的水印区域', 'error');
      return;
    }

    // 第三步：切换到推理状态
    setAppState('inferring');

    try {
      // 第四步：执行 AI 推理（当前从 CDN 加载的 window.ort 运行）
      const result = await startInference(imgData, maskData, selectedModel);

      // 第五步：将推理结果绘制到主 Canvas
      drawResult(result);

      // 第六步：生成 data URL，供 CompareView 滑块对比使用
      const mainCanvas = mainCanvasRef.current;
      if (mainCanvas) {
        const blob = await canvasToBlob(mainCanvas);
        const url = URL.createObjectURL(blob);
        setResultDataUrl(url);
      }

      // 第七步：切换到完成状态
      setAppState('done');
      showToast('水印擦除完成！', 'success');
    } catch (err) {
      // 推理失败：恢复到编辑状态，显示错误信息
      setAppState('editing');
      showToast(err instanceof Error ? err.message : '推理失败，请重试', 'error');
    }
  }, [getImageData, getMaskData, selectedModel, startInference, drawResult, mainCanvasRef, showToast]);

  /**
   * 下载处理后的图片
   * 将主 Canvas 内容导出为 PNG 并触发浏览器下载
   * 文件命名格式：cleaned_{原始文件名}.png
   */
  const handleDownload = useCallback(async () => {
    const canvas = mainCanvasRef.current;
    if (!canvas || !image) return;

    try {
      const blob = await canvasToBlob(canvas);
      const url = URL.createObjectURL(blob);

      // 创建临时 <a> 标签触发下载
      const a = document.createElement('a');
      const originalName = image.file.name.replace(/\.[^.]+$/, '');
      a.href = url;
      a.download = `cleaned_${originalName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('下载成功！', 'success');
    } catch {
      showToast('下载失败', 'error');
    }
  }, [mainCanvasRef, image, showToast]);

  // ==========================================================================
  // 错误提示（通过 useEffect 展示 toast，避免渲染期副作用）
  // ==========================================================================

  useEffect(() => {
    if (uploadError) showToast(uploadError, 'error');
  }, [uploadError, showToast]);

  useEffect(() => {
    if (inferError) showToast(inferError, 'error');
  }, [inferError, showToast]);

  // ==========================================================================
  // 渲染
  // ==========================================================================

  /**
   * 页面布局：
   * ┌───────────── Header ─────────────┐
   * │  idle → 居中 DropZone            │
   * │  else → 左：Canvas + 对比预览     │
   * │         右：工具面板 + 模型选择    │
   * │         底：信息栏                │
   * └─────────── Toast ────────────────┘
   *
   * 响应式：桌面端左右分栏，移动端上下堆叠
   */
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* 顶部导航：标题 + 模型状态 */}
        <Header modelStatus={modelStatus} modelProgress={modelProgress} />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* ========== 初始状态：显示上传区域 ========== */}
          {appState === 'idle' && (
            <div className="max-w-lg mx-auto mt-20">
              <DropZone
                onFileSelect={handleFileSelect}
                disabled={uploading}
              />
              {uploading && (
                <div className="mt-4">
                  <ProgressBar progress={50} status="加载图片中..." />
                </div>
              )}
            </div>
          )}

          {/* ========== 编辑 / 推理中 / 完成状态 ========== */}
          {(appState === 'editing' || appState === 'inferring' || appState === 'done') && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
              {/* ------ 左栏：Canvas 主区域 ------ */}
              <div className="flex flex-col gap-4">
                {/* 顶部操作栏：重新上传 + 开始擦除 */}
                <div className="flex items-center justify-between">
                  <button onClick={handleReset} className="btn-secondary text-sm py-2 px-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 inline-block">
                      <path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                    重新上传
                  </button>

                  <button
                    onClick={handleErase}
                    /* 推理中或无遮罩时禁用 */
                    disabled={appState === 'inferring' || !hasMask}
                    className="btn-primary text-sm py-2 px-6"
                  >
                    {appState === 'inferring' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        处理中...
                      </span>
                    ) : (
                      '开始擦除水印'
                    )}
                  </button>
                </div>

                {/* Canvas 三明治图层：原图 + 遮罩（absolute 叠加） */}
                <ImageEditor
                  image={image}
                  mainCanvasRef={mainCanvasRef}
                  maskCanvasRef={maskCanvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  showMask={true}
                />

                {/* 推理进度条 */}
                {appState === 'inferring' && (
                  <ProgressBar progress={progress} status="AI 正在推理..." />
                )}

                {/* 对比预览：可拖拽滑块对比原图和擦除结果 */}
                {appState === 'done' && image && (
                  <CompareView
                    originalDataUrl={image.dataUrl}
                    resultDataUrl={resultDataUrl}
                    onDownload={handleDownload}
                  />
                )}
              </div>

              {/* ------ 右栏：工具面板 + 模型选择 ------ */}
              <aside className="space-y-4">
                {/* 涂抹工具面板：画笔/橡皮擦/矩形/撤销/重置 */}
                <ToolPanel
                  currentTool={currentTool}
                  brushSize={brushSize}
                  onToolChange={handleToolChange}
                  onBrushSizeChange={handleBrushSizeChange}
                  onUndo={undo}
                  onResetMask={resetMask}
                  hasMask={hasMask}
                  disabled={appState === 'inferring'}
                />

                {/* AI 模型信息面板 */}
                <ModelSelector
                  modelStatus={modelStatus}
                  modelProgress={modelProgress}
                />
              </aside>
            </div>
          )}

          {/* ========== 底部信息栏（非 idle 状态显示）========== */}
          {(appState !== 'idle') && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">隐私安全</p>
                <p className="text-sm font-medium text-gray-700">本地运行</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">图像格式</p>
                <p className="text-sm font-medium text-gray-700">JPG / PNG / WebP</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">最大文件</p>
                <p className="text-sm font-medium text-gray-700">50MB</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">处理速度</p>
                <p className="text-sm font-medium text-gray-700">3-15 秒</p>
              </div>
            </div>
          )}
        </main>

        {/* 全局 Toast 消息 */}
        <Toast
          message={toast?.message ?? null}
          type={toast?.type ?? 'info'}
          onClose={() => setToast(null)}
        />
      </div>
    </ErrorBoundary>
  );
}