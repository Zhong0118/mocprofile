import type { Person, ResearchDirection } from '../types';

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

// Research directions. Each one points at public work that shows the interest; locale texts use
// "关注 / looks at", not claims of finished research.
export const directions: ResearchDirection[] = [
  { id: 'agent-security', projectIds: ['agentguard-chain'] },
  { id: 'multi-agent', projectIds: ['evoteam', 'mars'] },
  { id: 'aigc-attribution', projectIds: ['aigc-detector'] },
];
