import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
    >
      <Languages className="h-5 w-5" />
      <span className="text-xs uppercase">{language === 'zh' ? 'EN' : '中'}</span>
    </button>
  );
}
