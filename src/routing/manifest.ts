// Route manifest: the only list of public pages. Prerendering, sitemap, metadata and
// the content checks all derive from it, so a page cannot exist in one place and not another.
import { LOCALES, type ContentBundle, type Locale } from '@/content/types';
import { findProjectDetail, findPublicationDetail, hasCv } from '@/content/selectors';
import {
  cvPath,
  homePath,
  localeFromPath,
  projectPath,
  publicationPath,
  stripLocale,
  withLocale,
} from './paths';

export type RouteKind = 'home' | 'cv' | 'project' | 'publication';

export interface RouteEntry {
  path: string;
  locale: Locale;
  kind: RouteKind;
  id?: string;
  alternates: Record<Locale, string>;
}

export function buildRouteManifest(bundle: ContentBundle): RouteEntry[] {
  const entries: RouteEntry[] = [];
  const add = (kind: RouteKind, pathFor: (l: Locale) => string, id?: string) => {
    const alternates = Object.fromEntries(LOCALES.map((l) => [l, pathFor(l)])) as Record<
      Locale,
      string
    >;
    for (const locale of LOCALES) entries.push({ path: alternates[locale], locale, kind, id, alternates });
  };

  add('home', homePath);
  if (hasCv(bundle)) add('cv', cvPath);
  for (const p of bundle.publications.filter((p) => p.detail)) {
    add('publication', (l) => publicationPath(l, p.id), p.id);
  }
  for (const p of bundle.projects.filter((p) => p.detail)) {
    add('project', (l) => projectPath(l, p.id), p.id);
  }
  return entries;
}

/** Resolves a pathname (with or without trailing slash) to a manifest entry. */
export function matchRoute(bundle: ContentBundle, pathname: string): RouteEntry | undefined {
  const locale = localeFromPath(pathname);
  let rest = stripLocale(pathname);
  if (!rest.endsWith('/')) rest += '/';
  const path = withLocale(locale, rest);
  const entry = buildRouteManifest(bundle).find((e) => e.path === path);
  if (!entry) return undefined;
  // Guard against stale manifests: details must still resolve in the full collection.
  if (entry.kind === 'project' && !findProjectDetail(bundle, entry.id!)) return undefined;
  if (entry.kind === 'publication' && !findPublicationDetail(bundle, entry.id!)) return undefined;
  return entry;
}
