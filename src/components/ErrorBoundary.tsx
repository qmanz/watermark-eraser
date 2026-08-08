/**
 * ErrorBoundary.tsx — React 错误边界
 *
 * 捕获子组件树中渲染阶段的 JavaScript 错误，防止整个应用白屏。
 *
 * 注意：
 * - 只能捕获 render 阶段的同步错误
 * - 不能捕获：异步错误（Promise rejection）、事件处理器中未处理的错误
 * - 生产环境中建议上报错误到监控平台（如 Sentry）
 */

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  /** 从子组件错误中派生状态（替代已废弃的 componentDidCatch 用于渲染） */
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      // 错误降级 UI
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">出错了</h3>
            <p className="text-sm text-gray-500 mb-4">
              {this.state.error || '发生了未知错误'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}