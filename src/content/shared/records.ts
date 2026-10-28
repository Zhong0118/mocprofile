import type { Award, CvConfig, Experience, Publication, SiteConfig, SkillGroup } from '../types';

export const site: SiteConfig = {
  url: 'https://mocprofile.vercel.app',
  updatedAt: '2026-10-28',
  copyrightStartYear: 2026,
};

// No confirmed publications yet. Add entries only with official title, full author order,
// status and a primary source. The section and its navigation item stay hidden while empty.
export const publications: Publication[] = [];

// No confirmed education / research / employment records with dates yet.
export const experience: Experience[] = [];

export const awards: Award[] = [];

export const skills: SkillGroup[] = [];

export const cv: CvConfig = {
  updatedAt: '2026-10-28',
  // pdf: { zh: { href: '/files/cv-zh.pdf', updatedAt: '2026-10-28' } },
};
