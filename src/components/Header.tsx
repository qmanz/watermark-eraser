/**
 * Header.tsx — 顶部导航栏
 *
 * 显示：
 * - 应用 Logo（SVG 水印擦除图标）
 * - 应用名称 "WatermarkEraser"
 * - 右侧 AI 模型加载状态指示器（圆点 + 状态文字）
 *
 * 模型状态颜色映射：
 *   unloaded → 灰色    downloading → 橙色    ready → 绿色    error → 红色
 */

import type { ModelStatus } from '@/types';
import { MODEL_STATUS_CONFIG } from '@/constants';

interface HeaderProps {
  modelStatus: ModelStatus;
  modelProgress: number;
}

export default function Header({ modelStatus, modelProgress }: HeaderProps) {
  const base = MODEL_STATUS_CONFIG[modelStatus];
  // Header 定制：下载中时显示百分比
  const label = modelStatus === 'downloading' ? `加载中 ${modelProgress}%` : base.label;
  const color = base.color;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 左侧：Logo + 名称 */}
        <div className="flex items-center gap-3">
          {/* 自定义 SVG 图标：带水印标记的图片 */}
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <rect x="15" y="25" width="70" height="55" rx="8" stroke="#534AB7" strokeWidth="5"/>
            <path d="M25 45l15 15 20-25" stroke="#534AB7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="70" cy="30" r="12" fill="#7F77DD" opacity="0.3"/>
            <path d="M65 22l10 8" stroke="#7F77DD" strokeWidth="3" strokeLinecap="round"/>
            <path d="M65 30l10-8" stroke="#7F77DD" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <h1 className="text-lg font-medium text-gray-900">WatermarkEraser</h1>
        </div>

        {/* 右侧：AI 模型状态指示 */}
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-gray-500">{label}</span>
        </div>
      </div>
    </header>
  );
}