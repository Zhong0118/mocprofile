import type { Language, SiteContent } from '@/types/content';

export async function getContent(language: Language): Promise<SiteContent> {
  const mod = language === 'zh'
    ? await import('@/content/zh/index')
    : await import('@/content/en/index');
  return mod.default;
}

const contentCache: Record<Language, SiteContent | null> = { zh: null, en: null };

export function getContentSync(language: Language): SiteContent | null {
  return contentCache[language];
}

export function setContentCache(language: Language, content: SiteContent) {
  contentCache[language] = content;
}
