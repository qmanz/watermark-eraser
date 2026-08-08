/**
 * DropZone.tsx — 图片上传区域
 *
 * 支持三种上传方式：
 * 1. 拖拽文件到区域
 * 2. 点击区域弹出文件选择器
 * 3. (未来可扩展) 粘贴剪贴板图片
 *
 * 交互状态：
 * - 默认：灰色虚线边框
 * - 拖入时：紫色边框 + 浅紫背景（视觉反馈）
 * - 禁用时：半透明 + 禁止点击
 *
 * 文件限制：
 * - 格式：JPEG / PNG / WebP / BMP
 * - 大小：最大 50MB
 */

import { useCallback, useRef, useState } from 'react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  /** 是否正在拖拽文件进入区域 */
  const [isDragover, setIsDragover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ======== 拖拽事件处理 ========

  /** 文件拖入区域：高亮边框 */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragover(true);
  }, []);

  /** 文件拖出区域：恢复默认样式 */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragover(false);
  }, []);

  /** 必须阻止 dragover 的默认行为，否则无法触发 drop 事件 */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  /** 文件放下：获取第一个文件并回调 */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragover(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  // ======== 点击事件处理 ========

  /** 点击区域：触发隐藏的 <input type="file"> */
  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  /** 文件选择器确认后回调 */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors duration-200 ${
        isDragover
          ? 'border-primary-400 bg-primary-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {/* 隐藏的文件输入框，由点击事件触发 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/bmp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 上传提示内容 */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
          {/* 图片上传图标 */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="#534AB7" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">
            拖拽图片到此处，或<span className="text-primary-600">点击选择</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            支持 JPG / PNG / WebP · 最大 50MB
          </p>
        </div>
      </div>
    </div>
  );
}