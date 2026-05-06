import type { SiteContent } from '@/types/content';
import { profile } from './profile';
import { navigation } from './navigation';
import { publications } from './publications';
import { projects } from './projects';
import { repositories } from './repositories';
import { experience } from './experience';
import { awards } from './awards';
import { cv } from './cv';
import { common } from './common';

const content: SiteContent = {
  profile,
  navigation,
  publications,
  projects,
  repositories,
  experience,
  awards,
  cv,
  common,
};

export default content;
