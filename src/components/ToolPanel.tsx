/**
 * ToolPanel.tsx — 右侧工具栏
 *
 * 提供三组控制面板：
 * 1. 画笔工具选择：画笔 / 橡皮擦 / 矩形选区 + 撤销 / 清除
 * 2. 画笔设置：画笔大小滑块 + 遮罩颜色预览
 * 3. 快捷键提示：B/E/R/Ctrl+Z
 *
 * 所有交互通过 props 回调通知父组件（App.tsx），ToolPanel 自己不维护状态
 */

import type { ToolType } from '@/types';
import { useI18n } from '@/i18n';

interface ToolPanelProps {
  currentTool: ToolType;
  brushSize: number;
  onToolChange: (tool: ToolType) => void;
  onBrushSizeChange: (size: number) => void;
  onUndo: () => void;
  onResetMask: () => void;
  hasMask: boolean;
  disabled?: boolean;
}

export default function ToolPanel({
  currentTool,
  brushSize,
  onToolChange,
  onBrushSizeChange,
  onUndo,
  onResetMask,
  hasMask,
  disabled,
}: ToolPanelProps) {
  const { t } = useI18n();

  /** 画笔工具配置 */
  const TOOLS: { type: ToolType; label: string; icon: string }[] = [
    { type: 'brush', label: t.toolbar.brush, icon: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
    { type: 'eraser', label: t.toolbar.eraser, icon: 'M3 21l6-6h12v6H3zm3.5-6L18 3.5 21.5 7 10 18.5H6.5z' },
    { type: 'rectangle', label: t.toolbar.rectangle, icon: 'M3 3h18v18H3V3zm2 2v14h14V5H5z' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ===== 面板 1：画笔工具选择 ===== */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{t.toolbar.title}</h3>
        <div className="flex gap-2 flex-wrap">
          {TOOLS.map((tool) => (
            <button
              key={tool.type}
              onClick={() => onToolChange(tool.type)}
              disabled={disabled}
              className={`btn-tool ${currentTool === tool.type ? 'btn-tool-active' : ''}`}
              title={tool.label}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 inline-block">
                <path d={tool.icon} />
              </svg>
              {tool.label}
            </button>
          ))}

          <button
            onClick={onUndo}
            disabled={disabled || !hasMask}
            className="btn-tool"
            title={t.toolbar.undoShortcut}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 inline-block">
              <path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
            {t.toolbar.undo}
          </button>

          <button
            onClick={onResetMask}
            disabled={disabled || !hasMask}
            className="btn-tool text-red-500 hover:text-red-600"
            title={t.toolbar.clearShortcut}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 inline-block">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" />
            </svg>
            {t.toolbar.clear}
          </button>
        </div>
      </div>

      {/* ===== 面板 2：画笔设置 ===== */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{t.brushSettings.title}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{t.brushSettings.size}</span>
          <span className="text-xs text-gray-500">{brushSize}px</span>
        </div>
        <input
          type="range"
          min={4}
          max={80}
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full accent-primary-600"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">{t.brushSettings.maskColor}</span>
          <span
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: 'rgba(255, 0, 0, 0.4)' }}
          />
        </div>
      </div>

      {/* ===== 面板 3：快捷键提示 ===== */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t.shortcuts.title}</h3>
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{t.shortcuts.keys.B}</kbd>
            <span>{t.shortcuts.brush}</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{t.shortcuts.keys.E}</kbd>
            <span>{t.shortcuts.eraser}</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{t.shortcuts.keys.R}</kbd>
            <span>{t.shortcuts.rectangle}</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{t.shortcuts.keys.ctrlZ}</kbd>
            <span>{t.shortcuts.undo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}