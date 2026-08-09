/**
 * LanguageSwitcher.tsx — 语言切换组件
 *
 * 下拉菜单选择语言，包含语言名称和国旗/文字标识。
 * 支持四种语言：中文、英文、西班牙文、阿拉伯文。
 */

import { useI18n, type Locale } from '@/i18n';

/** 语言选项配置：代码、显示名称、短标识 */
const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: 'zh', label: '简体中文', flag: '中' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'ar', label: 'العربية', flag: 'ع' },
];

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-400">{t.language.label}</label>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Locale)}
        className="text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:border-primary-400 cursor-pointer"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}