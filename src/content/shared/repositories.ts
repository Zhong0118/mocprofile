import type { Repository, SourceNote } from '../types';

// One record per public, non-fork repository that backs a listed project. Read from the public
// GitHub REST API (no token) and the repositories' own files. Stars, forks and traffic are not
// recorded. `license` is only set when the repository contains a license file.
const github: SourceNote = {
  label: 'GitHub repository metadata',
  url: 'https://api.github.com/users/Zhong0118/repos',
  retrievedAt: '2026-10-28',
};

const repo = (
  id: string,
  name: string,
  createdAt: string,
  languages: string[],
  projectIds: string[],
  extra: Partial<Pick<Repository, 'release' | 'license'>> = {},
): Repository => ({
  id,
  owner: 'Zhong0118',
  name,
  url: `https://github.com/Zhong0118/${name}`,
  languages,
  projectIds,
  createdAt,
  archived: false,
  fork: false,
  source: github,
  ...extra,
});

export const repositories: Repository[] = [
  repo('agentguard-chain', 'AgentGuard-Chain', '2026-06-24', ['Python'], ['agentguard-chain']),
  repo('evoteam', 'EvoTeam', '2026-09-02', ['Python'], ['evoteam']),
  repo('pinnote', 'PinNote', '2026-05-18', ['Svelte', 'Rust', 'TypeScript'], ['pinnote'], {
    release: 'https://github.com/Zhong0118/PinNote/releases',
  }),
  repo('multi-tenant-crm-builder', 'multi-tenant-CRM-builder', '2026-08-19', ['TypeScript'], [
    'multi-tenant-crm-builder',
  ]),
  repo('mars', 'MARS', '2026-05-02', ['Python'], ['mars']),
  repo('aigc-detector', 'aigc_detector', '2026-05-28', ['Python'], ['aigc-detector']),
  repo('paper-reader-skill', 'paper-reader-skill', '2026-09-16', ['Python'], ['paper-reader-skill'], {
    license: 'MIT',
  }),
  repo('richeditor', 'RichEditor', '2024-06-28', ['Vue', 'Python'], ['richeditor']),
];
