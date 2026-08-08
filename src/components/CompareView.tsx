/**
 * CompareView.tsx — 原图/结果对比预览
 *
 * 核心交互：可拖拽的滑块对比
 * - 左侧（slider 左边）→ 处理后的结果
 * - 右侧（slider 右边）→ 原图
 * - 滑块可鼠标拖拽移动（也支持触摸）
 *
 * CSS 实现原理：
 *   左侧结果图用 overflow: hidden 裁剪，
 *   宽度由 sliderPos 控制（百分比），
 *   图片本身保持 minWidth 防止被压缩变形
 *
 * 支持鼠标和触摸事件，手机上也能拖拽对比
 */

import { useState, useRef } from 'react';

interface CompareViewProps {
  originalDataUrl: string;
  resultDataUrl: string | null;
  onDownload: () => void;
}

export default function CompareView({
  originalDataUrl,
  resultDataUrl,
  onDownload,
}: CompareViewProps) {
  /** 滑块位置：0-100 百分比，50 = 居中 */
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  /** 鼠标拖拽滑块时更新位置 */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // 限制滑块范围在 5% - 95%，避免完全看不到某一侧
    setSliderPos(Math.max(5, Math.min(95, (x / rect.width) * 100)));
  };

  return (
    <div className="card">
      {/* 标题栏 + 下载按钮 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">对比预览</h3>
        {resultDataUrl && (
          <button
            onClick={onDownload}
            className="btn-primary text-sm py-2 px-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 inline-block">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            下载结果
          </button>
        )}
      </div>

      {/* 对比容器 */}
      <div
        ref={containerRef}
        className="relative w-full rounded-lg overflow-hidden border border-gray-200 cursor-col-resize"
        onMouseMove={handleMouseMove}
        onTouchMove={(e) => {
          // 触摸事件：多点触控取第一个触点
          const touch = e.touches[0];
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            setSliderPos(Math.max(5, Math.min(95, (x / rect.width) * 100)));
          }
        }}
      >
        {/* ===== 左侧：结果图（被裁剪） ===== */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            结果
          </div>
          {resultDataUrl ? (
            <img
              src={resultDataUrl}
              alt="处理后"
              className="w-full"
              style={{ maxWidth: 'none', minWidth: `${100 / (sliderPos / 100)}%` }}
            />
          ) : (
            <div className="w-full aspect-video bg-gray-200" />
          )}
        </div>

        {/* ===== 右侧：原图 ===== */}
        <div className="relative">
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
            原图
          </div>
          <img
            src={originalDataUrl}
            alt="原图"
            className="w-full"
          />
        </div>

        {/* ===== 滑块（白色竖线 + 圆形拖拽手柄） ===== */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md cursor-col-resize"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center shadow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2">
              <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}