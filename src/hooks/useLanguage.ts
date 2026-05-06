import { useContext } from 'react';
import { LanguageContext } from '@/providers/LanguageProvider';

export function useLanguage() {
  return useContext(LanguageContext);
}
