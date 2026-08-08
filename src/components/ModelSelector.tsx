/**
 * ModelSelector.tsx — AI 模型信息面板
 *
 * 当前仅使用 LaMa 模型（Large Mask Inpainting），效果最佳。
 * 显示模型状态（未加载/下载中/已就绪/失败）和下载进度。
 *
 * MI-GAN 因 hf-mirror.com CORS 限制暂时不可用，后续可通过 CORS 代理恢复。
 */

import type { ModelStatus } from '@/types';
import { MODEL_STATUS_CONFIG } from '@/constants';

interface ModelSelectorProps {
  modelStatus: ModelStatus;
  modelProgress: number;
}

export default function ModelSelector({
  modelStatus,
  modelProgress,
}: ModelSelectorProps) {
  const status = MODEL_STATUS_CONFIG[modelStatus];

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-gray-700 mb-3">AI 模型</h3>

      {/* 当前模型信息 */}
      <div className="p-3 rounded-lg border border-primary-200 bg-primary-50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-800">LaMa</span>
          <span
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ color: status.color, backgroundColor: status.bgColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            {status.label}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Large Mask Inpainting · 200MB · 效果最佳
        </p>
      </div>

      {/* 下载进度条 */}
      {modelStatus === 'downloading' && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>下载中</span>
            <span>{modelProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${modelProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {modelStatus === 'error' && (
        <p className="mt-2 text-xs text-red-500">
          加载失败，请刷新页面重试
        </p>
      )}
    </div>
  );
}