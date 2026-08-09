/**
 * CompareView.tsx — 原图/结果对比预览
 *
 * 核心交互：可拖拽的滑块对比
 * - 左侧（slider 左边）→ 处理后的结果
 * - 右侧（slider 右边）→ 原图
 * - 滑块可鼠标拖拽移动（也支持触摸）
 *
 * 实现原理：
 *   两张图 absolute 定位叠加，result 图在下面、原图在上面。
 *   原图左侧用 clip-path inset 裁剪，露出下面的 result 图。
 *   滑块竖线标记裁剪边界。
 *
 * 支持鼠标和触摸事件，手机上也能拖拽对比
 */

import { useState, useRef, useCallback } from 'react';
import { useI18n } from '@/i18n';

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
  const { t } = useI18n();
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    setSliderPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    updatePos(e.clientX);
  }, [updatePos]);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    updatePos(touch.clientX);
  }, [updatePos]);

  const clipRight = 100 - sliderPos;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">{t.compare.title}</h3>
        {resultDataUrl && (
          <button
            onClick={onDownload}
            className="btn-primary text-sm py-2 px-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 inline-block">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {t.actions.download}
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative w-full rounded-lg overflow-hidden border border-gray-200 select-none"
        style={{ cursor: 'ew-resize' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        <div className="relative">
          {resultDataUrl ? (
            <img
              src={resultDataUrl}
              alt={t.compare.result}
              className="w-full block"
              draggable={false}
            />
          ) : (
            <div className="w-full aspect-video bg-gray-200" />
          )}
        </div>

        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${clipRight}% 0 0)`,
          }}
        >
          <img
            src={originalDataUrl}
            alt={t.compare.original}
            className="w-full block"
            draggable={false}
          />
        </div>

        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
          {t.compare.result}
        </div>
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
          {t.compare.original}
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-20"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={() => { dragging.current = true; }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center shadow cursor-ew-resize select-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2">
              <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}