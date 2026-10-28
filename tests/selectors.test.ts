import { describe, expect, it } from 'vitest';
import {
  allProjects,
  allRepositories,
  featuredProjects,
  filterProjects,
  filterRepositories,
  findProjectDetail,
  formatDate,
  isModuleEnabled,
  parseProjectQuery,
  parseRepositoryQuery,
  pickFeatured,
  projectDateLabel,
  projectFilterCounts,
  relatedProjects,
  skillEvidence,
} from '@/content/selectors';
import { content } from '@/content';
import { MODULE_IDS } from '@/content/types';
import { emptyContent, fixtureContent } from '@/fixtures/content';

describe('modules', () => {
  it('keeps every module on, including the ones without entries', () => {
    for (const id of MODULE_IDS) {
      expect(isModuleEnabled(content, id)).toBe(true);
      expect(isModuleEnabled(emptyContent, id)).toBe(true);
    }
  });
});

describe('homepage selection', () => {
  it('features the author-selected projects in order, capped and never padded', () => {
    expect(featuredProjects(content).map((p) => p.id)).toEqual(['agentguard-chain', 'evoteam', 'pinnote']);
    expect(pickFeatured([{ id: 'a' }, { id: 'b', homepageOrder: 2 }, { id: 'c', homepageOrder: 1 }], 3).map((i) => i.id)).toEqual(['c', 'b']);
    expect(featuredProjects(emptyContent)).toEqual([]);
  });

  it('orders the directory with featured projects first, then newest, and lists all of them', () => {
    const ids = allProjects(content).map((p) => p.id);
    expect(ids.slice(0, 3)).toEqual(['agentguard-chain', 'evoteam', 'pinnote']);
    expect(ids).toHaveLength(content.projects.length);
    expect(allRepositories(content)[0].id).toBe('agentguard-chain');
  });

  it('looks up details in the full collection, not only the homepage pick', () => {
    expect(findProjectDetail(fixtureContent, 'fx-project-a')).toBeDefined();
    expect(findProjectDetail(fixtureContent, 'fx-project-b')).toBeUndefined();
    expect(findProjectDetail(content, 'pinnote')).toBeUndefined();
  });
});

describe('project directory', () => {
  it('counts the type groups (engineering and competition share one)', () => {
    expect(projectFilterCounts(content)).toEqual({ all: 8, research: 4, tool: 2, engineering: 2 });
  });

  it('filters by type and keyword over name, summary and stack', () => {
    expect(filterProjects(content, 'zh', { type: 'tool', q: '' }).map((p) => p.id).sort()).toEqual(['paper-reader-skill', 'pinnote']);
    expect(filterProjects(content, 'en', { type: 'all', q: 'rust' }).map((p) => p.id)).toEqual(['pinnote']);
    expect(filterProjects(content, 'zh', { type: 'all', q: '便签' }).map((p) => p.id)).toEqual(['pinnote']);
    expect(filterProjects(content, 'en', { type: 'research', q: 'sqlite  pydantic' }).map((p) => p.id).sort()).toEqual(['evoteam', 'mars']);
    expect(filterProjects(content, 'en', { type: 'all', q: 'no-such-thing' })).toEqual([]);
  });

  it('falls back to safe defaults for invalid URL values', () => {
    expect(parseProjectQuery(new URLSearchParams('type=hacker&view=table&q=' + 'x'.repeat(200)))).toEqual({
      type: 'all',
      view: 'grid',
      q: 'x'.repeat(80),
    });
    expect(parseProjectQuery(new URLSearchParams('type=engineering&view=list'))).toMatchObject({ type: 'engineering', view: 'list' });
    expect(parseRepositoryQuery(content, new URLSearchParams('lang=COBOL'))).toEqual({ q: '', lang: '' });
  });

  it('filters repositories by language', () => {
    expect(filterRepositories(content, 'zh', { q: '', lang: 'Rust' }).map((r) => r.id)).toEqual(['pinnote']);
    expect(filterRepositories(content, 'zh', { q: '', lang: '' })).toHaveLength(8);
  });
});

describe('evidence and relations', () => {
  it('links every skill to the projects that use it', () => {
    expect(skillEvidence(content, 'rust').map((p) => p.id)).toEqual(['pinnote']);
    expect(skillEvidence(content, 'sqlite').map((p) => p.id).sort()).toEqual(['evoteam', 'mars']);
  });

  it('suggests related projects without the project itself', () => {
    const related = relatedProjects(content, 'evoteam').map((p) => p.id);
    expect(related).not.toContain('evoteam');
    expect(related[0]).toBe('mars');
  });
});

describe('dates', () => {
  it('never invents missing months', () => {
    expect(formatDate('2026', 'zh')).toBe('2026');
    expect(formatDate('2026-06', 'zh')).toBe('2026.06');
    expect(formatDate('2026-06', 'en')).toBe('Jun 2026');
    expect(formatDate('2026-10-28', 'en')).toBe('28 Oct 2026');
  });

  it('labels repository creation months as such', () => {
    const p = content.projects.find((x) => x.id === 'agentguard-chain')!;
    expect(projectDateLabel(p, 'zh', content.locales.zh)).toBe('仓库创建于 2026.06');
    expect(projectDateLabel(p, 'en', content.locales.en)).toBe('Repository created Jun 2026');
  });
});
