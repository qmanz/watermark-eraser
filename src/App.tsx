/**
 * App.tsx — WatermarkEraser 主应用
 *
 * 应用状态流转（appState）：
 *   idle → editing → inferring → done
 *              ↑                    │
 *              └─── (推理失败) ──────┘
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
import AdSlot from '@/components/AdSlot';
import Footer from '@/components/Footer';
import StaticPage from '@/components/StaticPage';
import type { PageRoute } from '@/components/Footer';
import { useCanvas } from '@/hooks/useCanvas';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useInference } from '@/hooks/useInference';
import { useI18n } from '@/i18n';
import { downloadAndCache } from '@/utils/model';

export default function App() {
  const { t } = useI18n();

  // ==========================================================================
  // 状态定义
  // ==========================================================================

  const [appState, setAppState] = useState<AppState>('idle');
  /** 页面路由：main（主应用）| about | contact | privacy */
  const [currentPage, setCurrentPage] = useState<PageRoute>('main');
  const selectedModel: ModelType = 'LaMa';
  const [modelStatus, setModelStatus] = useState<ModelStatus>('unloaded');
  const [modelProgress, setModelProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser' | 'rectangle'>('brush');
  const [brushSize, setBrushSizeState] = useState(24);
  const [hasMask, setHasMask] = useState(false);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [compareOriginalUrl, setCompareOriginalUrl] = useState<string | null>(null);

  // ==========================================================================
  // 工具函数
  // ==========================================================================

  const showToast = useCallback((message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  // ==========================================================================
  // 自定义 Hooks
  // ==========================================================================

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

  const { image, error: uploadError, loading: uploading, processFile, reset: resetImage } = useImageUpload();
  const { progress, error: inferError, startInference } = useInference();

  // ==========================================================================
  // 模型预加载
  // ==========================================================================

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

  const handleFileSelect = useCallback(
    async (file: File) => {
      const result = await processFile(file);
      if (result) {
        setAppState('editing');
        resetMask();
        setResultDataUrl(null);
        setCompareOriginalUrl(null);
      }
    },
    [processFile, resetMask]
  );

  const handleReset = useCallback(() => {
    resetImage();
    resetMask();
    setResultDataUrl(null);
    setCompareOriginalUrl(null);
    setAppState('idle');
    modelLoadingRef.current = false;
  }, [resetImage, resetMask]);

  const handleToolChange = useCallback(
    (tool: 'brush' | 'eraser' | 'rectangle') => {
      setCurrentTool(tool);
      setCanvasTool(tool);
    },
    [setCanvasTool]
  );

  const handleBrushSizeChange = useCallback(
    (size: number) => {
      setBrushSizeState(size);
      setCanvasBrushSize(size);
    },
    [setCanvasBrushSize]
  );

  const handleErase = useCallback(async () => {
    const imgData = getImageData();
    const maskData = getMaskData();

    if (!imgData || !maskData) {
      showToast(t.toast.maskRequired, 'error');
      return;
    }

    const maskPixels = maskData.data;
    let hasAnyMask = false;
    for (let i = 0; i < maskPixels.length; i += 4) {
      if (maskPixels[i] > 128 || maskPixels[i + 3] > 0) {
        hasAnyMask = true;
        break;
      }
    }

    if (!hasAnyMask) {
      showToast(t.toast.maskRequired, 'error');
      return;
    }

    setAppState('inferring');

    try {
      const result = await startInference(imgData, maskData, selectedModel);
      drawResult(result);

      const resultCanvas = document.createElement('canvas');
      resultCanvas.width = result.width;
      resultCanvas.height = result.height;
      const rCtx = resultCanvas.getContext('2d')!;
      rCtx.putImageData(result, 0, 0);
      const resultUrl = resultCanvas.toDataURL('image/png');
      setResultDataUrl(resultUrl);

      if (image) {
        try {
          const origCanvas = document.createElement('canvas');
          origCanvas.width = result.width;
          origCanvas.height = result.height;
          const oCtx = origCanvas.getContext('2d')!;
          oCtx.drawImage(image.image, 0, 0, result.width, result.height);
          const origUrl = origCanvas.toDataURL('image/png');
          setCompareOriginalUrl(origUrl);
        } catch (e) {
          console.warn('[Erase] Failed to generate compare original:', e);
        }
      }

      setAppState('done');
      showToast(t.toast.eraseSuccess, 'success');
    } catch (err) {
      console.error('[Erase] Failed:', err);
      setAppState('editing');
      showToast(t.toast.eraseFail, 'error');
    }
  }, [getImageData, getMaskData, selectedModel, startInference, drawResult, mainCanvasRef, showToast, image, t]);

  const handleDownload = useCallback(() => {
    if (!resultDataUrl || !image) {
      showToast(t.actions.noResultDownload, 'error');
      return;
    }

    try {
      const a = document.createElement('a');
      const originalName = image.file.name.replace(/\.[^.]+$/, '');
      a.href = resultDataUrl;
      a.download = `cleaned_${originalName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast(t.actions.downloadSuccess, 'success');
    } catch {
      showToast(t.actions.downloadFail, 'error');
    }
  }, [resultDataUrl, image, showToast, t]);

  // ==========================================================================
  // 错误提示
  // ==========================================================================

  useEffect(() => {
    if (uploadError) showToast(uploadError, 'error');
  }, [uploadError, showToast]);

  useEffect(() => {
    if (inferError) showToast(inferError, 'error');
  }, [inferError, showToast]);

  // ==========================================================================
  // 页面路由
  // ==========================================================================

  if (currentPage !== 'main') {
    return (
      <ErrorBoundary t={t}>
        <StaticPage page={currentPage} onBack={() => setCurrentPage('main')} />
      </ErrorBoundary>
    );
  }

  // ==========================================================================
  // 渲染
  // ==========================================================================

  return (
    <ErrorBoundary t={t}>
      <div className="min-h-screen bg-gray-50">
        <Header modelStatus={modelStatus} modelProgress={modelProgress} />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* ========== 顶部广告位：Leaderboard (728x90) ========== */}
          <div className="mb-6 flex justify-center">
            <AdSlot variant="leaderboard" />
          </div>

          {/* ========== 初始状态 ========== */}
          {appState === 'idle' && (
            <div className="max-w-lg mx-auto mt-20">
              <DropZone
                onFileSelect={handleFileSelect}
                disabled={uploading}
              />
              {uploading && (
                <div className="mt-4">
                  <ProgressBar progress={50} status={t.progress.loading} />
                </div>
              )}
            </div>
          )}

          {/* ========== 编辑 / 推理中 / 完成状态 ========== */}
          {(appState === 'editing' || appState === 'inferring' || appState === 'done') && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
              {/* 左栏：Canvas 主区域 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <button onClick={handleReset} className="btn-secondary text-sm py-2 px-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 inline-block">
                      <path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                    {t.actions.reupload}
                  </button>

                  <button
                    onClick={handleErase}
                    disabled={appState === 'inferring' || !hasMask}
                    className="btn-primary text-sm py-2 px-6"
                  >
                    {appState === 'inferring' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        {t.actions.processing}
                      </span>
                    ) : (
                      t.actions.startErase
                    )}
                  </button>
                </div>

                {appState !== 'done' && (
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
                )}

                {appState === 'inferring' && (
                  <ProgressBar progress={progress} status={t.progress.inferring} />
                )}

                {/* 结果区广告位：Responsive */}
                {appState === 'done' && (
                  <div className="flex justify-center">
                    <AdSlot variant="responsive" />
                  </div>
                )}

                {appState === 'done' && image && (
                  <CompareView
                    originalDataUrl={compareOriginalUrl || image.dataUrl}
                    resultDataUrl={resultDataUrl}
                    onDownload={handleDownload}
                  />
                )}
              </div>

              {/* 右栏：工具面板 + 侧边栏广告 + 模型信息 */}
              <aside className="space-y-4">
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

                {/* 侧边栏广告位：Medium Rectangle (300x250) */}
                <AdSlot variant="medium-rectangle" />

                <ModelSelector
                  modelStatus={modelStatus}
                  modelProgress={modelProgress}
                />
              </aside>
            </div>
          )}

          {/* ========== 底部信息栏 ========== */}
          {(appState !== 'idle') && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">{t.infoBar.privacy.label}</p>
                <p className="text-sm font-medium text-gray-700">{t.infoBar.privacy.value}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">{t.infoBar.formats.label}</p>
                <p className="text-sm font-medium text-gray-700">{t.infoBar.formats.value}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">{t.infoBar.maxFile.label}</p>
                <p className="text-sm font-medium text-gray-700">{t.infoBar.maxFile.value}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">{t.infoBar.speed.label}</p>
                <p className="text-sm font-medium text-gray-700">{t.infoBar.speed.value}</p>
              </div>
            </div>
          )}

          {/* ========== 底部广告位：Responsive ========== */}
          <div className="mt-6 flex justify-center">
            <AdSlot variant="responsive" />
          </div>
        </main>

        <Footer onNavigate={setCurrentPage} />

        <Toast
          message={toast?.message ?? null}
          type={toast?.type ?? 'info'}
          onClose={() => setToast(null)}
        />
      </div>
    </ErrorBoundary>
  );
}