/**
 * Toast.tsx — 消息提示组件
 *
 * 从右上角滑入的消息提示，支持三种类型：
 * - error: 红色，错误信息
 * - success: 绿色，成功提示
 * - info: 蓝色，一般信息
 *
 * 行为：
 * - 显示后 duration 毫秒自动消失（默认 4 秒）
 * - 可手动点击关闭按钮
 * - 入场动画：slide-in（从右侧滑入）
 *
 * 使用方式：
 *   <Toast message="上传失败" type="error" onClose={() => setError(null)} />
 */

import { useEffect, useState, useRef } from 'react';

interface ToastProps {
  message: string | null;
  type?: 'error' | 'success' | 'info';
  duration?: number;   // 自动消失时间（毫秒）
  onClose: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);
  const innerTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      // 等出场动画播完再真正移除（CSS transition 300ms）
      innerTimerRef.current = setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      if (innerTimerRef.current) {
        clearTimeout(innerTimerRef.current);
        innerTimerRef.current = undefined;
      }
    };
  }, [message, duration, onClose]);

  // 没有消息或已隐藏时不渲染
  if (!message || !visible) return null;

  /** 类型 → 配色方案 */
  const colors: Record<string, string> = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  /** 类型 → SVG 图标 path */
  const icons: Record<string, string> = {
    error: 'M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${colors[type]} shadow-sm`}
      >
        {/* 左侧图标 */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="flex-shrink-0"
        >
          <path d={icons[type]} />
        </svg>
        {/* 消息文字 */}
        <span className="text-sm">{message}</span>
        {/* 手动关闭按钮 */}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 hover:opacity-70 flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}