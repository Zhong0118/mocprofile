import { useLanguage } from './useLanguage';
import type { SiteContent } from '@/types/content';

export function useContent(): { content: SiteContent | null; language: string } {
  const { content, language } = useLanguage();
  return { content, language };
}
