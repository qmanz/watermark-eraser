/**
 * ImageEditor.tsx — 图片编辑器（Canvas 三明治图层）
 *
 * 这是整个应用最核心的组件，负责：
 * 1. 加载并显示用户上传的图片
 * 2. 管理三层 Canvas 结构
 * 3. 处理鼠标/触摸事件绘制遮罩
 *
 * Canvas 三层结构：
 *   z-index 2: maskCanvas（遮罩层，直接接收鼠标事件，绘制红色涂抹）
 *   z-index 1: mainCanvas（原图层，不被鼠标事件影响）
 *   z-index 0: spacer img（隐藏的 <img> 标签，撑开容器保持宽高比）
 *
 * 为什么用隐藏 img 而不是 JS 计算高度？
 *   隐藏 img 标签的 maxWidth/maxHeight 会自动处理响应式缩放，
 *   Canvas 的 position:absolute 完美覆盖，无需手动 re-layout
 *
 * 鼠标坐标换算：
 *   鼠标 clientX → canvas.getBoundingClientRect() → CSS 尺寸
 *   → canvas.width（像素尺寸）→ 缩放比例 → 像素坐标
 *   这一步在 useCanvas.getPos() 中完成
 */

import { useEffect, useRef } from 'react';
import type { UploadedImage } from '@/types';

interface ImageEditorProps {
  image: UploadedImage | null;
  mainCanvasRef: React.RefObject<HTMLCanvasElement>;
  maskCanvasRef: React.RefObject<HTMLCanvasElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  showMask: boolean;
  onReady?: () => void;
}

/** 最大像素尺寸限制（防止大图导致 Canvas 性能问题） */
const MAX_DIM = 2048;

export default function ImageEditor({
  image,
  mainCanvasRef,
  maskCanvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  showMask,
  onReady,
}: ImageEditorProps) {
  const spacerRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * 当 image 变化时（用户上传新图片），重新初始化 Canvas
   * - 设置 Canvas 像素尺寸（等比缩放到 MAX_DIM 以内）
   * - 绘制原图到 mainCanvas
   * - 清空 maskCanvas
   * - 更新 spacer img 的 src，触发 CSS 重新布局
   */
  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!image || !mainCanvas || !maskCanvas) return;

    const img = image.image;
    let w = img.naturalWidth;
    let h = img.naturalHeight;

    // 等比缩放到限制尺寸以内
    if (w > MAX_DIM || h > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }

    // 设置 Canvas 像素尺寸（这是绘图精度，不是 CSS 显示尺寸）
    mainCanvas.width = w;
    mainCanvas.height = h;
    maskCanvas.width = w;
    maskCanvas.height = h;

    // 绘制原图
    const mainCtx = mainCanvas.getContext('2d');
    if (mainCtx) {
      mainCtx.clearRect(0, 0, w, h);
      mainCtx.drawImage(img, 0, 0, w, h);
    }

    // 清空上次的遮罩
    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(0, 0, w, h);
    }

    // 更新隐藏的 spacer img，触发容器重排
    if (spacerRef.current) {
      spacerRef.current.src = image.dataUrl;
    }

    console.log('[ImageEditor] Canvas setup complete:', w, 'x', h);
    onReady?.();
  }, [image, mainCanvasRef, maskCanvasRef, onReady]);

  // 没有图片时不渲染编辑器
  if (!image) return null;

  return (
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden p-4 flex items-center justify-center">
      {/* 外层容器：position:relative + inline-block 使子元素宽高自然撑开 */}
      <div
        ref={wrapperRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%',
        }}
      >
        {/**
         * 第 0 层：隐藏 spacer img
         * visibility: hidden —— 不可见但占据空间，用于撑开容器
         * maxHeight: 70vh —— 限制图片高度，超出屏幕时自动缩小
         */}
        <img
          ref={spacerRef}
          src={image.dataUrl}
          alt=""
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '70vh',
            visibility: 'hidden',
          }}
        />

        {/**
         * 第 1 层：原图 Canvas
         * position: absolute —— 覆盖在 spacer 上面
         * zIndex: 1 —— 最低层（spacer 不是定位元素，不算层级）
         */}
        <canvas
          ref={mainCanvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            zIndex: 1,
          }}
        />

        {/**
         * 第 2 层：遮罩 Canvas
         * opacity: 0.5 —— 半透明红色遮罩，能看到下方原图
         * cursor: crosshair —— 十字准星光标
         * 所有鼠标事件（onMouseDown/Move/Up/Leave）绑定在这一层
         */}
        <canvas
          ref={maskCanvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            zIndex: 2,
            opacity: showMask ? 0.5 : 1,
            cursor: 'crosshair',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        />
      </div>
    </div>
  );
}