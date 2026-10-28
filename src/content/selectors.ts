// The single place that decides what is shown where: module switches, homepage selections,
// directory filters, skill evidence and detail lookups. Pages and the route manifest go through here.
// A module's presence comes from site.modules, never from how many entries it has.
import {
  PROJECT_FILTERS,
  type ContentBundle,
  type Experience,
  type Locale,
  type LocaleContent,
  type ModuleId,
  type PartialDate,
  type Project,
  type ProjectFilter,
  type ProjectKind,
  type Publication,
  type PublicationStatus,
  type PublicationType,
  type Repository,
} from './types';

export const HOMEPAGE_LIMITS = { projects: 3, repositories: 4, publications: 4, experience: 3 } as const;

/** Compares partial dates ("2026", "2026-06", "2026-06-24") newest first. */
export function compareDatesDesc(a: PartialDate, b: PartialDate): number {
  return a < b ? 1 : a > b ? -1 : 0;
}

function byDateThenId<T extends { id: string }>(dateOf: (item: T) => PartialDate) {
  return (a: T, b: T) => compareDatesDesc(dateOf(a), dateOf(b)) || a.id.localeCompare(b.id);
}

const byOrderThenDate =
  <T extends { id: string; homepageOrder?: number }>(dateOf: (item: T) => PartialDate) =>
  (a: T, b: T) => {
    const oa = a.homepageOrder ?? Infinity;
    const ob = b.homepageOrder ?? Infinity;
    return oa !== ob ? oa - ob : byDateThenId(dateOf)(a, b);
  };

export const publicationDate = (p: Publication): PartialDate => p.date ?? String(p.year);
export const projectDate = (p: Project): PartialDate => p.start;
export const experienceDate = (e: Experience): PartialDate => e.start;

// ------------------------------------------------------------------------------- modules

export function isModuleEnabled(bundle: ContentBundle, id: ModuleId): boolean {
  return bundle.site.modules[id]?.enabled !== false;
}

// ------------------------------------------------------------------------------- collections

/** Full collections in display order: featured first (homepageOrder), then newest, stable by ID. */
export function allPublications(bundle: ContentBundle): Publication[] {
  return [...bundle.publications].sort(byDateThenId(publicationDate));
}
export function allProjects(bundle: ContentBundle): Project[] {
  return [...bundle.projects].sort(byOrderThenDate(projectDate));
}
export function allExperience(bundle: ContentBundle): Experience[] {
  return [...bundle.experience].sort(byDateThenId(experienceDate));
}
export function allAwards(bundle: ContentBundle) {
  return [...bundle.awards].sort(byDateThenId((a) => a.date));
}
/** Repositories follow the order of the projects they back. */
export function allRepositories(bundle: ContentBundle): Repository[] {
  const order = allProjects(bundle).map((p) => p.id);
  const rank = (r: Repository) => Math.min(...r.projectIds.map((id) => order.indexOf(id)).filter((i) => i >= 0), Infinity);
  return [...bundle.repositories].sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id));
}

/** Homepage pick: only items with homepageOrder, in that order. The limit is a cap, never a quota. */
export function pickFeatured<T extends { id: string; homepageOrder?: number }>(items: T[], limit: number): T[] {
  return items
    .filter((i) => i.homepageOrder !== undefined)
    .sort((a, b) => a.homepageOrder! - b.homepageOrder! || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function featuredProjects(bundle: ContentBundle): Project[] {
  const picked = pickFeatured(bundle.projects, HOMEPAGE_LIMITS.projects);
  return picked.length ? picked : allProjects(bundle).slice(0, HOMEPAGE_LIMITS.projects);
}

export function homepageRepositories(bundle: ContentBundle): Repository[] {
  return allRepositories(bundle).slice(0, HOMEPAGE_LIMITS.repositories);
}

export function homepagePublications(bundle: ContentBundle): Publication[] {
  const picked = pickFeatured(bundle.publications, HOMEPAGE_LIMITS.publications);
  return picked.length ? picked : allPublications(bundle).slice(0, HOMEPAGE_LIMITS.publications);
}

export function homepageExperience(bundle: ContentBundle): Experience[] {
  const picked = pickFeatured(bundle.experience, HOMEPAGE_LIMITS.experience);
  return picked.length ? picked : allExperience(bundle).slice(0, HOMEPAGE_LIMITS.experience);
}

// ------------------------------------------------------------------------------- lookups

export function findPublicationDetail(bundle: ContentBundle, id: string) {
  return bundle.publications.find((p) => p.id === id && p.detail);
}

export function findProjectDetail(bundle: ContentBundle, id: string) {
  return bundle.projects.find((p) => p.id === id && p.detail);
}

export function directionsOfProject(bundle: ContentBundle, projectId: string) {
  return bundle.directions.filter((d) => d.projectIds.includes(projectId));
}

/** Projects that share a direction, then projects of the same kind. Never the project itself. */
export function relatedProjects(bundle: ContentBundle, projectId: string, limit = 3): Project[] {
  const self = bundle.projects.find((p) => p.id === projectId);
  if (!self) return [];
  const sameDirection = new Set(directionsOfProject(bundle, projectId).flatMap((d) => d.projectIds));
  const score = (p: Project) => (sameDirection.has(p.id) ? 2 : 0) + (p.kind === self.kind ? 1 : 0);
  return allProjects(bundle)
    .filter((p) => p.id !== projectId && score(p) > 0)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export function repositoryOfProject(bundle: ContentBundle, projectId: string) {
  return bundle.repositories.find((r) => r.projectIds.includes(projectId));
}

export function skillById(bundle: ContentBundle, skillId: string) {
  for (const g of bundle.skills) {
    const s = g.skills.find((x) => x.id === skillId);
    if (s) return s;
  }
  return undefined;
}

export function skillEvidence(bundle: ContentBundle, skillId: string): Project[] {
  const skill = skillById(bundle, skillId);
  if (!skill) return [];
  return allProjects(bundle).filter((p) => skill.projectIds.includes(p.id));
}

// ------------------------------------------------------------------------------- project directory

export function projectFilterOf(kind: ProjectKind): Exclude<ProjectFilter, 'all'> {
  if (kind === 'research-prototype') return 'research';
  if (kind === 'tool') return 'tool';
  return 'engineering';
}

export type ProjectView = 'grid' | 'list';
export interface ProjectQuery {
  type: ProjectFilter;
  q: string;
  view: ProjectView;
}
export const DEFAULT_PROJECT_QUERY: ProjectQuery = { type: 'all', q: '', view: 'grid' };
const MAX_QUERY = 80;

/** Reads URL state. Unknown or malformed values fall back to the defaults instead of failing. */
export function parseProjectQuery(params: URLSearchParams): ProjectQuery {
  const type = params.get('type');
  const view = params.get('view');
  return {
    type: (PROJECT_FILTERS as readonly string[]).includes(type ?? '') ? (type as ProjectFilter) : 'all',
    q: (params.get('q') ?? '').slice(0, MAX_QUERY),
    view: view === 'list' ? 'list' : 'grid',
  };
}

export function serializeQuery(values: Record<string, string>, defaults: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) if (v && v !== defaults[k]) params.set(k, v);
  const s = params.toString();
  return s ? `?${s}` : '';
}

const normalize = (s: string) => s.toLocaleLowerCase().normalize('NFKC');

function matchesQuery(haystack: (string | undefined)[], q: string): boolean {
  if (!q) return true;
  const text = normalize(haystack.filter(Boolean).join(' \u0000 '));
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => text.includes(term));
}

export function filterProjects(bundle: ContentBundle, locale: Locale, query: Pick<ProjectQuery, 'type' | 'q'>): Project[] {
  const texts = bundle.locales[locale].projects;
  return allProjects(bundle).filter(
    (p) =>
      (query.type === 'all' || projectFilterOf(p.kind) === query.type) &&
      matchesQuery([p.name, texts[p.id]?.summary, ...(p.techStack ?? [])], query.q),
  );
}

export function projectFilterCounts(bundle: ContentBundle): Record<ProjectFilter, number> {
  const counts = { all: bundle.projects.length, research: 0, tool: 0, engineering: 0 };
  for (const p of bundle.projects) counts[projectFilterOf(p.kind)]++;
  return counts;
}

// ------------------------------------------------------------------------------- repositories

export interface RepositoryQuery {
  q: string;
  lang: string;
}

export function repositoryLanguages(bundle: ContentBundle): string[] {
  return [...new Set(bundle.repositories.flatMap((r) => r.languages))].sort((a, b) => a.localeCompare(b));
}

export function parseRepositoryQuery(bundle: ContentBundle, params: URLSearchParams): RepositoryQuery {
  const lang = params.get('lang') ?? '';
  return {
    q: (params.get('q') ?? '').slice(0, MAX_QUERY),
    lang: repositoryLanguages(bundle).includes(lang) ? lang : '',
  };
}

export function filterRepositories(bundle: ContentBundle, locale: Locale, query: RepositoryQuery): Repository[] {
  const texts = bundle.locales[locale].repositories;
  return allRepositories(bundle).filter(
    (r) =>
      (!query.lang || r.languages.includes(query.lang)) &&
      matchesQuery([r.name, texts[r.id]?.summary, ...r.languages], query.q),
  );
}

// ------------------------------------------------------------------------------- publications

export interface PublicationQuery {
  year: string;
  type: PublicationType | '';
  status: PublicationStatus | '';
}

export function publicationFacets(bundle: ContentBundle) {
  const uniq = <T,>(xs: T[]) => [...new Set(xs)];
  return {
    years: uniq(bundle.publications.map((p) => String(p.year))).sort().reverse(),
    types: uniq(bundle.publications.map((p) => p.type)),
    statuses: uniq(bundle.publications.map((p) => p.publicationStatus)),
  };
}

export function parsePublicationQuery(bundle: ContentBundle, params: URLSearchParams): PublicationQuery {
  const f = publicationFacets(bundle);
  const pick = <T extends string>(value: string | null, allowed: T[]) =>
    allowed.includes(value as T) ? (value as T) : ('' as const);
  return {
    year: pick(params.get('year'), f.years),
    type: pick(params.get('type'), f.types),
    status: pick(params.get('status'), f.statuses),
  };
}

export function filterPublications(bundle: ContentBundle, query: PublicationQuery): Publication[] {
  return allPublications(bundle).filter(
    (p) =>
      (!query.year || String(p.year) === query.year) &&
      (!query.type || p.type === query.type) &&
      (!query.status || p.publicationStatus === query.status),
  );
}

// ------------------------------------------------------------------------------- dates

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Deterministic date formatting (identical on server and client). */
export function formatDate(date: PartialDate, locale: Locale): string {
  const [y, m, d] = date.split('-');
  if (!m) return y;
  const month = Number(m);
  if (locale === 'zh') return d ? `${y} 年 ${month} 月 ${Number(d)} 日` : `${y}.${m}`;
  return d ? `${Number(d)} ${MONTHS_EN[month - 1]} ${y}` : `${MONTHS_EN[month - 1]} ${y}`;
}

/** "仓库创建于 2026.06" or an author-confirmed start, depending on what the date means. */
export function projectDateLabel(project: Project, locale: Locale, t: LocaleContent): string {
  const ui = t.ui.project;
  const start = formatDate(project.start, locale);
  if (project.startKind === 'repository-created') return ui.repositoryCreated(start);
  return project.end ? `${start} – ${formatDate(project.end, locale)}` : ui.since(start);
}
