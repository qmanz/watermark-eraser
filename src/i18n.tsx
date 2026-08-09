/**
 * i18n.tsx — 多语言支持 Context
 *
 * 支持语言：zh (简体中文)、en (英文)、es (西班牙文)、ar (阿拉伯文/RTL)
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import zh from '@/locales/zh';

/** 翻译文本类型：所有语言共享此接口（结构由中文定义，值各自不同） */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Translations extends Record<keyof typeof zh, unknown> {
  app: { title: string; description: string };
  header: { title: string };
  dropzone: { dragHint: string; clickHere: string; formats: string };
  toolbar: { title: string; brush: string; eraser: string; rectangle: string; undo: string; clear: string; undoShortcut: string; clearShortcut: string };
  brushSettings: { title: string; size: string; maskColor: string };
  shortcuts: { title: string; brush: string; eraser: string; rectangle: string; undo: string; keys: { B: string; E: string; R: string; ctrlZ: string } };
  model: { title: string; description: string; downloading: string; unloaded: string; ready: string; error: string; retryHint: string };
  actions: { reupload: string; startErase: string; processing: string; download: string; downloadSuccess: string; downloadFail: string; noResultDownload: string };
  progress: { loading: string; inferring: string };
  compare: { title: string; result: string; original: string };
  toast: { maskRequired: string; eraseSuccess: string; eraseFail: string };
  infoBar: {
    privacy: { label: string; value: string };
    formats: { label: string; value: string };
    maxFile: { label: string; value: string };
    speed: { label: string; value: string };
  };
  errorBoundary: { title: string; unknown: string; refresh: string };
  ad: { label: string };
  language: { label: string };
}

/** 支持的语言代码 */
export type Locale = 'zh' | 'en' | 'es' | 'ar';

import en from '@/locales/en';
import es from '@/locales/es';
import ar from '@/locales/ar';

/** 各语言配置 */
const LOCALE_CONFIG: Record<Locale, { label: string; dir: 'ltr' | 'rtl'; translations: Translations }> = {
  zh: { label: '简体中文', dir: 'ltr', translations: zh as unknown as Translations },
  en: { label: 'English', dir: 'ltr', translations: en as unknown as Translations },
  es: { label: 'Español', dir: 'ltr', translations: es as unknown as Translations },
  ar: { label: 'العربية', dir: 'rtl', translations: ar as unknown as Translations },
};

/** i18n Context 值 */
interface I18nContextValue {
  t: Translations;
  lang: Locale;
  setLang: (lang: Locale) => void;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLang(): Locale {
  if (typeof window === 'undefined') return 'zh';
  const stored = localStorage.getItem('lang') as Locale | null;
  if (stored && stored in LOCALE_CONFIG) return stored;
  const navLang = navigator.language.toLowerCase();
  if (navLang.startsWith('ar')) return 'ar';
  if (navLang.startsWith('es')) return 'es';
  if (navLang.startsWith('en')) return 'en';
  return 'zh';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(getInitialLang);

  const setLang = useCallback((newLang: Locale) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  }, []);

  const config = LOCALE_CONFIG[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = config.dir;
  }, [lang, config.dir]);

  return (
    <I18nContext.Provider value={{ t: config.translations, lang, setLang, dir: config.dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}