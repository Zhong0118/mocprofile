// The single place that decides what is shown where: homepage selections, CV presence,
// visible navigation and detail lookups. Every page and the route manifest go through here.
import type {
  ContentBundle,
  Experience,
  Locale,
  PartialDate,
  Project,
  Publication,
} from './types';

export const HOMEPAGE_LIMITS = { publications: 4, projects: 3, experience: 3 } as const;

/** Compares partial dates ("2026", "2026-06", "2026-06-24") newest first. */
export function compareDatesDesc(a: PartialDate, b: PartialDate): number {
  return a < b ? 1 : a > b ? -1 : 0;
}

function byDateThenId<T extends { id: string }>(dateOf: (item: T) => PartialDate) {
  return (a: T, b: T) => compareDatesDesc(dateOf(a), dateOf(b)) || a.id.localeCompare(b.id);
}

export const publicationDate = (p: Publication): PartialDate => p.date ?? String(p.year);
export const projectDate = (p: Project): PartialDate => p.start;
export const experienceDate = (e: Experience): PartialDate => e.start;

/** Full public collections in CV order: newest first, stable by ID. */
export function allPublications(bundle: ContentBundle): Publication[] {
  return [...bundle.publications].sort(byDateThenId(publicationDate));
}
export function allProjects(bundle: ContentBundle): Project[] {
  return [...bundle.projects].sort(byDateThenId(projectDate));
}
export function allExperience(bundle: ContentBundle): Experience[] {
  return [...bundle.experience].sort(byDateThenId(experienceDate));
}

/**
 * Homepage pick: if any item carries homepageOrder, only those are shown, in that order.
 * Otherwise newest first. The limit is a cap, never a quota.
 */
export function pickForHomepage<T extends { id: string; homepageOrder?: number }>(
  items: T[],
  limit: number,
  dateOf: (item: T) => PartialDate,
): T[] {
  const ordered = items.filter((i) => i.homepageOrder !== undefined);
  const pool = ordered.length
    ? ordered.sort((a, b) => a.homepageOrder! - b.homepageOrder! || a.id.localeCompare(b.id))
    : [...items].sort(byDateThenId(dateOf));
  return pool.slice(0, limit);
}

export interface HomepageSelection {
  publications: Publication[];
  projects: Project[];
  experience: Experience[];
  /** True when the full collection has entries not shown on the homepage. */
  more: { publications: boolean; projects: boolean; experience: boolean };
}

export function selectHomepage(bundle: ContentBundle): HomepageSelection {
  const publications = pickForHomepage(
    bundle.publications,
    HOMEPAGE_LIMITS.publications,
    publicationDate,
  );
  const projects = pickForHomepage(bundle.projects, HOMEPAGE_LIMITS.projects, projectDate);
  const experience = pickForHomepage(
    bundle.experience,
    HOMEPAGE_LIMITS.experience,
    experienceDate,
  );
  const cv = hasCv(bundle);
  return {
    publications,
    projects,
    experience,
    more: {
      publications: cv && bundle.publications.length > publications.length,
      projects: cv && bundle.projects.length > projects.length,
      experience: cv && bundle.experience.length > experience.length,
    },
  };
}

/** The CV exists only when there is substantive public material. No manual switch. */
export function hasCv(bundle: ContentBundle): boolean {
  return (
    bundle.experience.length > 0 ||
    bundle.publications.length > 0 ||
    bundle.projects.length > 0 ||
    bundle.awards.length > 0
  );
}

export interface NavVisibility {
  publications: boolean;
  projects: boolean;
  cv: boolean;
  blog: boolean;
}

export function navVisibility(bundle: ContentBundle): NavVisibility {
  return {
    publications: bundle.publications.length > 0,
    projects: bundle.projects.length > 0,
    cv: hasCv(bundle),
    blog: Boolean(bundle.person.links.blog),
  };
}

export function findPublicationDetail(bundle: ContentBundle, id: string) {
  return bundle.publications.find((p) => p.id === id && p.detail);
}

export function findProjectDetail(bundle: ContentBundle, id: string) {
  return bundle.projects.find((p) => p.id === id && p.detail);
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Deterministic date formatting (identical on server and client). */
export function formatDate(date: PartialDate, locale: Locale): string {
  const [y, m, d] = date.split('-');
  if (!m) return y;
  const month = Number(m);
  if (locale === 'zh') return d ? `${y} 年 ${month} 月 ${Number(d)} 日` : `${y}.${m}`;
  return d ? `${Number(d)} ${MONTHS_EN[month - 1]} ${y}` : `${MONTHS_EN[month - 1]} ${y}`;
}
