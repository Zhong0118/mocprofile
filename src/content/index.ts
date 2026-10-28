// Production content bundle. Only confirmed, public material may be imported here.
// Test fixtures live in src/fixtures and must never be imported from production code.
import type { ContentBundle } from './types';
import { focus, person } from './shared/person';
import { projects } from './shared/projects';
import { awards, cv, experience, publications, site, skills } from './shared/records';
import { zh } from './locales/zh';
import { en } from './locales/en';

export const content: ContentBundle = {
  site,
  person,
  focus,
  publications,
  projects,
  experience,
  awards,
  skills,
  cv,
  locales: { zh, en },
};
