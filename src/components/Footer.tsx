/**
 * Footer.tsx — 底部导航栏
 *
 * 显示：
 * - 关于我们 / 联系我们 / 隐私政策 三个导航链接
 * - 版权信息
 * - 响应式：移动端链接纵向排列
 */

import { useI18n } from '@/i18n';

export type PageRoute = 'main' | 'about' | 'contact' | 'privacy';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useI18n();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 左侧：导航链接 */}
          <nav className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => onNavigate('about')}
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              {t.footer.about}
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              {t.footer.contact}
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              {t.footer.privacy}
            </button>
          </nav>

          {/* 右侧：版权信息 */}
          <p className="text-xs text-gray-400">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}