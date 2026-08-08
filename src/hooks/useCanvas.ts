/**
 * useCanvas.ts — Canvas 交互 Hook
 *
 * 这是整个应用最复杂的 Hook，负责所有 Canvas 交互逻辑：
 *
 * 核心职责：
 * 1. 管理两层 Canvas 的 ref（mainCanvasRef、maskCanvasRef）
 * 2. 处理三种画笔工具的鼠标事件（brush / eraser / rectangle）
 * 3. 管理遮罩历史栈（撤销功能，最多 50 步）
 * 4. 提供对外接口：getMaskData、getImageData、drawResult
 *
 * 画笔实现：
 *   - brush: fillStyle = 'rgba(255, 0, 0, 0.5)'，在 maskCanvas 上画半透明红色圆
 *   - eraser: globalCompositeOperation = 'destination-out'，擦除 maskCanvas 上的像素
 *   - rectangle: fillRect，从鼠标按下点拖到松开点画矩形
 *
 * 历史记录（撤销功能）：
 *   每次鼠标按下前，将当前 maskCanvas 的完整 ImageData 存入 history 数组。
 *   撤销时回退到上一个快照。最多保存 50 步以控制内存。
 *
 * 鼠标坐标系统：
 *   Canvas 有「CSS 显示尺寸」和「像素尺寸」两个独立属性。
 *   CSS 尺寸由浏览器按 maxWidth/maxHeight 缩放，像素尺寸保持固定。
 *   getPos() 通过 getBoundingClientRect() 获取 CSS 尺寸，
 *   计算 scaleX/scaleY 将 clientX/clientY 转换为像素坐标。
 */

import { useRef, useCallback } from 'react';
import type { ToolType, MaskHistory } from '@/types';
import { MAX_MASK_HISTORY } from '@/constants';

interface UseCanvasOptions {
  /** 遮罩内容变化时回调（hasMask=true 表示有遮罩，激活擦除按钮） */
  onMaskChange?: (hasMask: boolean) => void;
}

export function useCanvas(options: UseCanvasOptions = {}) {
  // ======== Refs — 不触发重渲染 ========

  /** 原图 Canvas 的 DOM 引用 */
  const mainCanvasRef = useRef<HTMLCanvasElement>(null!);
  /** 遮罩 Canvas 的 DOM 引用（接收所有鼠标事件） */
  const maskCanvasRef = useRef<HTMLCanvasElement>(null!);
  /** 是否正在拖拽绘制（鼠标按下后、松开前） */
  const isDrawing = useRef(false);
  /** 当前选中的画笔工具 */
  const currentTool = useRef<ToolType>('brush');
  /** 画笔大小（px） */
  const brushSize = useRef(24);
  /** 遮罩历史快照栈 */
  const history = useRef<MaskHistory[]>([]);
  /** 当前历史位置（-1 表示无记录，0 表示第一个快照） */
  const historyIndex = useRef(-1);
  /** 矩形工具的起点坐标 */
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  // ======== State — 触发重渲染 ========

  // ======== 坐标工具 ========

  /**
   * 将鼠标 clientX/clientY 转换为 Canvas 像素坐标
   *
   * 换算公式：
   *   pixelX = (clientX - rect.left) × (canvas.width / rect.width)
   *   即 CSS 显示位置 × 像素缩放比
   */
  const getPos = useCallback((canvas: HTMLCanvasElement, e: React.MouseEvent): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // ======== 绘制操作 ========

  /** 在遮罩层画一个红色半透明圆（画笔模式） */
  const drawCircleAt = useCallback((x: number, y: number) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = brushSize.current;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fill();
    ctx.restore();
  }, []);

  /**
   * 在遮罩层擦除一个圆（橡皮擦模式）
   * 关键：使用 globalCompositeOperation = 'destination-out'
   *       这会擦除目标 Canvas 上的像素（而不是覆盖成白色）
   *       clearRect 不可行，因为会清除整个矩形而非圆形
   */
  const eraseAt = useCallback((x: number, y: number) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = brushSize.current;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, []);

  // ======== 历史记录 ========

  /** 保存当前遮罩状态到历史栈（最多 50 步） */
  const pushHistory = useCallback(() => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyIndex.current++;
    // 如果撤销后又做了新操作，丢弃"未来"的快照
    history.current = history.current.slice(0, historyIndex.current);
    history.current.push({ imageData: data, timestamp: Date.now() });
    // 限制最大 50 步（每步约 8MB，总计 400MB 内存）
    if (history.current.length > MAX_MASK_HISTORY) {
      history.current.shift();
      historyIndex.current--;
    }
  }, []);

  /** 撤销上一步操作 */
  const undo = useCallback(() => {
    const canvas = maskCanvasRef.current;
    if (!canvas || historyIndex.current < 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    historyIndex.current--;
    const entry = history.current[historyIndex.current];
    ctx.putImageData(entry.imageData, 0, 0);
    // 检查撤销后是否还有遮罩残留
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let hasAny = false;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) { hasAny = true; break; }
    }
    options.onMaskChange?.(hasAny);
  }, [options]);

  /** 清空所有遮罩 */
  const resetMask = useCallback(() => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.current = [];
    historyIndex.current = -1;
    options.onMaskChange?.(false);
  }, [options]);

  // ======== 鼠标事件处理 ========

  /** 鼠标按下：开始绘制 */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const canvas = maskCanvasRef.current;
      if (!canvas) return;
      e.preventDefault();

      const pos = getPos(canvas, e);

      // 矩形工具：只记录起点，等 mouseUp 时再画
      if (currentTool.current === 'rectangle') {
        startPoint.current = pos;
        return;
      }

      // 画笔/橡皮擦：立即开始绘制
      isDrawing.current = true;
      pushHistory();

      if (currentTool.current === 'brush') {
        drawCircleAt(pos.x, pos.y);
      } else if (currentTool.current === 'eraser') {
        eraseAt(pos.x, pos.y);
      }
    },
    [pushHistory, drawCircleAt, eraseAt, getPos]
  );

  /** 鼠标移动：持续绘制 */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = maskCanvasRef.current;
      if (!canvas) return;
      if (!isDrawing.current && !startPoint.current) return;

      const pos = getPos(canvas, e);

      if (isDrawing.current) {
        if (currentTool.current === 'brush') {
          drawCircleAt(pos.x, pos.y);
        } else if (currentTool.current === 'eraser') {
          eraseAt(pos.x, pos.y);
        }
      }
    },
    [drawCircleAt, eraseAt, getPos]
  );

  /** 鼠标松开：结束绘制 */
  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const canvas = maskCanvasRef.current;
      if (!canvas) { isDrawing.current = false; return; }

      // 矩形工具：松开时绘制矩形
      if (currentTool.current === 'rectangle' && startPoint.current) {
        const pos = getPos(canvas, e);
        pushHistory();
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const x = Math.min(startPoint.current.x, pos.x);
          const y = Math.min(startPoint.current.y, pos.y);
          const w = Math.abs(pos.x - startPoint.current.x);
          const h = Math.abs(pos.y - startPoint.current.y);
          ctx.save();
          ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
          ctx.fillRect(x, y, w, h);
          ctx.restore();
          options.onMaskChange?.(true);
        }
        startPoint.current = null;
      }

      // 画笔/橡皮擦：标记有遮罩内容
      if (isDrawing.current) {
        options.onMaskChange?.(true);
      }

      isDrawing.current = false;
    },
    [pushHistory, options, getPos]
  );

  /** 鼠标离开 Canvas 区域：强制结束绘制 */
  const handleMouseLeave = useCallback(() => {
    startPoint.current = null;
    isDrawing.current = false;
  }, []);

  // ======== 工具切换 ========

  const setTool = useCallback((tool: ToolType) => {
    currentTool.current = tool;
  }, []);

  const setBrushSize = useCallback((size: number) => {
    brushSize.current = size;
  }, []);

  // ======== 数据提取 ========

  /** 获取遮罩层的 ImageData（传给 AI 推理） */
  const getMaskData = useCallback((): ImageData | null => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, []);

  /** 获取原图层的 ImageData（传给 AI 推理） */
  const getImageData = useCallback((): ImageData | null => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, []);

  /** 将 AI 推理结果绘制到原图 Canvas 上 */
  const drawResult = useCallback((imageData: ImageData) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(imageData, 0, 0);
  }, []);

  return {
    mainCanvasRef,
    maskCanvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    setTool,
    setBrushSize,
    undo,
    resetMask,
    getMaskData,
    getImageData,
    drawResult,
  };
}

/**
 * 快捷键监听
 *
 * 全局键盘快捷键（由 App.tsx 注册）：
 *   B → 画笔    E → 橡皮擦    R → 矩形选区    Ctrl+Z → 撤销
 *
 * 实现位置：App.tsx 的 useEffect 中
 */