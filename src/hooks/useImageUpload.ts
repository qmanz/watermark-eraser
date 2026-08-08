/**
 * useImageUpload.ts — 图片上传 Hook
 *
 * 管理图片上传的完整生命周期：
 * 1. 接收 File 对象
 * 2. 校验文件类型和大小
 * 3. 加载为 HTMLImageElement
 * 4. 生成 ObjectURL（用于 preview 和遮罩绘制）
 * 5. 返回 UploadedImage 数据对象
 *
 * 注意：
 * - processFile 是异步的，返回 Promise<UploadedImage | null>
 * - 图片的实际 Canvas 绘制由 ImageEditor 负责（通过 useEffect + image prop）
 * - reset 会释放 ObjectURL 防止内存泄漏
 */

import { useState, useCallback } from 'react';
import type { UploadedImage } from '@/types';
import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '@/constants';

interface UseImageUploadOptions {
  maxSize?: number;
  acceptedTypes?: string[];
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxSize = MAX_FILE_SIZE,
    acceptedTypes = ALLOWED_IMAGE_TYPES,
  } = options;

  const [image, setImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * 处理用户上传的文件
   * @param file 用户选择的 File 对象
   * @returns UploadedImage 或 null（校验失败/加载失败）
   */
  const processFile = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      setError(null);

      // 校验文件类型
      if (!acceptedTypes.includes(file.type)) {
        setError('不支持的图片格式，请使用 JPG、PNG、WebP 或 BMP');
        return null;
      }

      // 校验文件大小
      if (file.size > maxSize) {
        setError(`文件大小超过 ${Math.round(maxSize / 1024 / 1024)}MB 上限`);
        return null;
      }

      setLoading(true);

      try {
        // 1. File → HTMLImageElement（base64 data URL）
        const img = await loadImage(file);

        // 2. 生成 Blob URL（比 base64 更高效）
        const dataUrl = URL.createObjectURL(file);

        const uploaded: UploadedImage = {
          file,
          dataUrl,
          image: img,
          width: img.naturalWidth,
          height: img.naturalHeight,
        };

        setImage(uploaded);
        setLoading(false);
        return uploaded;
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载图片失败');
        setLoading(false);
        return null;
      }
    },
    [acceptedTypes, maxSize]
  );

  /** 重置状态：释放 ObjectURL 防止内存泄漏 */
  const reset = useCallback(() => {
    if (image?.dataUrl) {
      URL.revokeObjectURL(image.dataUrl);
    }
    setImage(null);
    setError(null);
    setLoading(false);
  }, [image]);

  return {
    image,
    error,
    loading,
    processFile,
    reset,
    setError,
  };
}

/**
 * 从 File 对象加载 HTMLImageElement
 * 先通过 FileReader 读取为 base64 data URL，再设置给 Image 元素
 */
function loadImage(file: File): Promise<HTMLImageElement> {
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