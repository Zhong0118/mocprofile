// Route manifest: the only list of public pages. Prerendering, sitemap, metadata and
// the content checks all derive from it, so a page cannot exist in one place and not another.
// Index pages exist whenever their module is enabled, even with no entries (they show an empty state).
import { LOCALES, type ContentBundle, type Locale, type ModuleId } from '@/content/types';
import { findProjectDetail, findPublicationDetail, isModuleEnabled } from '@/content/selectors';
import {
  aboutPath,
  cvPath,
  homePath,
  localeFromPath,
  projectPath,
  projectsPath,
  publicationPath,
  publicationsPath,
  repositoriesPath,
  stripLocale,
  withLocale,
} from './paths';

export type RouteKind = 'home' | 'about' | 'projects' | 'publications' | 'repositories' | 'cv' | 'project' | 'publication';

export interface RouteEntry {
  path: string;
  locale: Locale;
  kind: RouteKind;
  id?: string;
  alternates: Record<Locale, string>;
}

const INDEX_PAGES: [RouteKind, ModuleId, (l: Locale) => string][] = [
  ['about', 'about', aboutPath],
  ['projects', 'projects', projectsPath],
  ['publications', 'publications', publicationsPath],
  ['repositories', 'repositories', repositoriesPath],
  ['cv', 'cv', cvPath],
];

export function buildRouteManifest(bundle: ContentBundle): RouteEntry[] {
  const entries: RouteEntry[] = [];
  const add = (kind: RouteKind, pathFor: (l: Locale) => string, id?: string) => {
    const alternates = Object.fromEntries(LOCALES.map((l) => [l, pathFor(l)])) as Record<Locale, string>;
    for (const locale of LOCALES) entries.push({ path: alternates[locale], locale, kind, id, alternates });
  };

  add('home', homePath);
  for (const [kind, module, pathFor] of INDEX_PAGES) if (isModuleEnabled(bundle, module)) add(kind, pathFor);
  if (isModuleEnabled(bundle, 'publications')) {
    for (const p of bundle.publications.filter((p) => p.detail)) add('publication', (l) => publicationPath(l, p.id), p.id);
  }
  if (isModuleEnabled(bundle, 'projects')) {
    for (const p of bundle.projects.filter((p) => p.detail)) add('project', (l) => projectPath(l, p.id), p.id);
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
