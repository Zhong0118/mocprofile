// Production content bundle. Only confirmed, public material may be imported here.
// Test fixtures live in src/fixtures and must never be imported from production code.
import type { BlogFeedSnapshot, ContentBundle } from './types';
import { directions, person } from './shared/person';
import { projects } from './shared/projects';
import { repositories } from './shared/repositories';
import { skills } from './shared/skills';
import { awards, cv, experience, publications, site } from './shared/records';
import blog from './generated/blog-feed.json';
import { zh } from './locales/zh';
import { en } from './locales/en';

export const content: ContentBundle = {
  site,
  person,
  directions,
  publications,
  projects,
  repositories,
  experience,
  awards,
  skills,
  cv,
  blog: blog as BlogFeedSnapshot,
  locales: { zh, en },
};
