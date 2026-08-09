/**
 * ModelSelector.tsx — AI 模型信息面板
 *
 * 当前仅使用 LaMa 模型（Large Mask Inpainting），效果最佳。
 * 显示模型状态（未加载/下载中/已就绪/失败）和下载进度。
 */

import type { ModelStatus } from '@/types';
import { MODEL_STATUS_CONFIG } from '@/constants';
import { useI18n } from '@/i18n';

interface ModelSelectorProps {
  modelStatus: ModelStatus;
  modelProgress: number;
}

export default function ModelSelector({
  modelStatus,
  modelProgress,
}: ModelSelectorProps) {
  const { t } = useI18n();
  const status = MODEL_STATUS_CONFIG[modelStatus];

  // 根据 modelStatus 映射 i18n 标签
  const statusLabel = (() => {
    switch (modelStatus) {
      case 'downloading': return t.model.downloading;
      case 'unloaded': return t.model.unloaded;
      case 'ready': return t.model.ready;
      case 'error': return t.model.error;
    }
  })();

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{t.model.title}</h3>

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
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {t.model.description}
        </p>
      </div>

      {modelStatus === 'downloading' && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{t.model.downloading}</span>
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

      {modelStatus === 'error' && (
        <p className="mt-2 text-xs text-red-500">
          {t.model.retryHint}
        </p>
      )}
    </div>
  );
}