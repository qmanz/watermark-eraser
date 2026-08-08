/**
 * ProgressBar.tsx — 推理进度条
 *
 * 在 AI 推理过程中显示进度，包含：
 * - 进度百分比（0-100）
 * - 状态文字（"AI 正在处理..."）
 * - 取消按钮（可选）
 *
 * 进度条动画使用 CSS transition-all 平滑过渡
 */

interface ProgressBarProps {
  progress: number;
  status: string;
  onCancel?: () => void;
}

export default function ProgressBar({ progress, status, onCancel }: ProgressBarProps) {
  return (
    <div className="card">
      {/* 顶部：状态文字 + 百分比 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{status}</span>
        <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
      </div>
      {/* 进度条主体 */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* 取消按钮（物理上不中断推理，仅用于 UI 展示） */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          取消
        </button>
      )}
    </div>
  );
}