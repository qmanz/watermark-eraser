/**
 * StaticPage.tsx — 静态内容页面（关于我们 / 联系我们 / 隐私政策）
 *
 * 统一渲染三种静态页面，通过 page 参数区分内容。
 * 页面内容从 i18n 翻译文件中读取，支持四种语言。
 */

import { useI18n } from '@/i18n';

interface StaticPageProps {
  page: 'about' | 'contact' | 'privacy';
  onBack: () => void;
}

export default function StaticPage({ page, onBack }: StaticPageProps) {
  const { t } = useI18n();

  const renderContent = () => {
    switch (page) {
      case 'about':
        return <AboutContent />;
      case 'contact':
        return <ContactContent />;
      case 'privacy':
        return <PrivacyContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
              <rect x="15" y="25" width="70" height="55" rx="8" stroke="#534AB7" strokeWidth="5"/>
              <path d="M25 45l15 15 20-25" stroke="#534AB7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="70" cy="30" r="12" fill="#7F77DD" opacity="0.3"/>
              <path d="M65 22l10 8" stroke="#7F77DD" strokeWidth="3" strokeLinecap="round"/>
              <path d="M65 30l10-8" stroke="#7F77DD" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <h1 className="text-lg font-medium text-gray-900">{t.header.title}</h1>
          </div>
        </div>
      </header>

      {/* 页面内容 */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="card">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

/** 关于我们页面 */
function AboutContent() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.pages.aboutTitle}</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        {t.pages.aboutContent}
      </p>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Features</h3>
      <ul className="space-y-2">
        {t.pages.aboutFeatures.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" className="mt-0.5 flex-shrink-0">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 联系我们页面 */
function ContactContent() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.pages.contactTitle}</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        {t.pages.contactIntro}
      </p>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-xs text-gray-400 mb-1">{t.pages.contactEmail}</p>
        <a
          href="mailto:support@watermarkeraser.com"
          className="text-primary-600 hover:text-primary-800 font-medium text-sm"
        >
          support@watermarkeraser.com
        </a>
      </div>
      <p className="text-xs text-gray-400">
        {t.pages.contactResponse}
      </p>
    </div>
  );
}

/** 隐私政策页面 */
function PrivacyContent() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.pages.privacyTitle}</h2>
      <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
        {t.pages.privacyContent}
      </div>
    </div>
  );
}