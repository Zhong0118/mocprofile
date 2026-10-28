import { createContext, useContext } from 'react';
import type { ContentBundle, Locale, LocaleContent } from '@/content/types';

export interface SiteValue {
  bundle: ContentBundle;
  locale: Locale;
  /** Texts of the current locale. */
  t: LocaleContent;
}

export const SiteContext = createContext<SiteValue | null>(null);

export function useSite(): SiteValue {
  const value = useContext(SiteContext);
  if (!value) throw new Error('useSite must be used inside SiteContext');
  return value;
}
