import type { FocusItem, Person } from '../types';

// Sources: GitHub public profile of Zhong0118 (name "mocX", blog field) — see docs/content-audit.md.
export const person: Person = {
  id: 'zhong0118',
  displayName: 'mocX',
  handle: 'Zhong0118',
  links: {
    github: 'https://github.com/Zhong0118',
    blog: 'https://moclab.top',
  },
};

// Research focus lines in the introduction. Each points at public work that shows the interest;
// wording in the locales uses "关注 / interested in", not claims of finished research.
export const focus: FocusItem[] = [
  { id: 'agent-security', projectId: 'agentguard-chain' },
  { id: 'multi-agent', projectId: 'evoteam' },
  { id: 'aigc-attribution', projectId: 'aigc-detector' },
];
