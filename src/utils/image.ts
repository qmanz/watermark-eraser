/**
 * image.ts — 图像处理工具函数
 *
 * 提供图片加载、Canvas 绘制、坐标转换、导出等底层图像操作。
 * 张量转换函数已统一移至 utils/tensor.ts，请从那里导入。
 */

import { MAX_IMAGE_DIM } from '@/constants';

/**
 * 从 File 对象加载图片为 HTMLImageElement
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 将图片绘制到 Canvas 上，自动缩放到不超过 maxDim
 */
export function drawImageToCanvas(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  maxDim = MAX_IMAGE_DIM
): { width: number; height: number } {
  let w = img.naturalWidth;
  let h = img.naturalHeight;

  if (w > maxDim || h > maxDim) {
    const ratio = Math.min(maxDim / w, maxDim / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return { width: w, height: h };
}

/**
 * 将 Canvas 内容导出为 Blob（用于下载）
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format = 'image/png',
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('导出图片失败'));
      },
      format,
      quality
    );
  });
}

/**
 * 获取鼠标在 Canvas 上的像素坐标
 *
 * Canvas CSS 显示尺寸 ≠ 像素尺寸（width/height 属性），
 * 需要用 scale 系数换算。
 */
export function getMousePos(
  canvas: HTMLCanvasElement,
  event: React.MouseEvent | MouseEvent
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}