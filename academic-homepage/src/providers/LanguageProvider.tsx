import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import type { Language, SiteContent } from '@/types/content';
import { getContent, setContentCache } from '@/lib/content';

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  content: SiteContent | null;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  toggleLanguage: () => {},
  content: null,
});

function getInitialLanguage(): Language {
  const stored = localStorage.getItem('language') as Language | null;
  if (stored === 'zh' || stored === 'en') return stored;
  return navigator.language.startsWith('zh') ? 'zh' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    localStorage.setItem('language', language);
    getContent(language).then((c) => {
      setContentCache(language, c);
      setContent(c);
    });
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
}
