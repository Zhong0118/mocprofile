import type { Locale } from '@/content/types';

// Chinese lives at the root, English under /en/. Every page path ends with a slash.

export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

/** Path without the locale prefix, always starting with "/". */
export function stripLocale(pathname: string): string {
  if (pathname === '/en') return '/';
  return pathname.startsWith('/en/') ? pathname.slice(3) : pathname;
}

export function withLocale(locale: Locale, path: string): string {
  return locale === 'en' ? `/en${path}` : path;
}

export const homePath = (locale: Locale) => withLocale(locale, '/');
export const cvPath = (locale: Locale) => withLocale(locale, '/cv/');
export const projectPath = (locale: Locale, id: string) => withLocale(locale, `/projects/${id}/`);
export const publicationPath = (locale: Locale, id: string) => withLocale(locale, `/papers/${id}/`);

/** The same page in the other language. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return withLocale(target, stripLocale(pathname));
}
