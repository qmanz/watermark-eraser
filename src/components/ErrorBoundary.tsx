/**
 * ErrorBoundary.tsx — React 错误边界
 *
 * 捕获子组件树中渲染阶段的 JavaScript 错误，防止整个应用白屏。
 */

import { Component, type ReactNode } from 'react';
import type { Translations } from '@/i18n';
import zh from '@/locales/zh';

interface Props {
  children: ReactNode;
  t?: Translations; // 可选翻译对象，fallback 到中文
}

interface State {
  hasError: boolean;
  error: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  get t() {
    return this.props.t ?? zh;
  }

  render() {
    if (this.state.hasError) {
      const { t } = this;
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{t.errorBoundary.title}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {this.state.error || t.errorBoundary.unknown}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm"
            >
              {t.errorBoundary.refresh}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}