import type { Award, CvConfig, Experience, ModuleConfig, ModuleId, Publication, SiteConfig } from '../types';
import { MODULE_IDS } from '../types';

// Every module is on. An empty collection renders the module with an empty state
// ("暂未列出公开条目 / No public entries listed"); it never removes the module or its nav item.
const modules = Object.fromEntries(MODULE_IDS.map((id) => [id, { enabled: true }])) as Record<
  ModuleId,
  ModuleConfig
>;

export const site: SiteConfig = {
  url: 'https://mocprofile.vercel.app',
  updatedAt: '2026-10-28',
  copyrightStartYear: 2026,
  modules,
};

// No confirmed publications yet. Add entries only with official title, full author order,
// status and a primary source (see docs/content-intake.md).
export const publications: Publication[] = [];

// No confirmed education / research / internship / employment records with dates yet.
// Do not infer a degree from the affiliation line.
export const experience: Experience[] = [];

// No confirmed awards. A competition entry is not an award; add one only with a public result.
export const awards: Award[] = [];

export const cv: CvConfig = {
  updatedAt: '2026-10-28',
  // pdf: { zh: { href: '/files/cv-zh.pdf', updatedAt: '2026-10-28' } },
};
