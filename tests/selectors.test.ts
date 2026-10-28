import { describe, expect, it } from 'vitest';
import {
  findProjectDetail,
  formatDate,
  hasCv,
  navVisibility,
  pickForHomepage,
  selectHomepage,
  allProjects,
} from '@/content/selectors';
import { content } from '@/content';
import { emptyContent, fixtureContent } from '@/fixtures/content';

describe('homepage selection', () => {
  it('caps each section without padding it', () => {
    const home = selectHomepage(fixtureContent);
    expect(home.publications).toHaveLength(4);
    expect(home.projects).toHaveLength(3);
    expect(home.experience).toHaveLength(3);
    expect(home.more).toEqual({ publications: true, projects: true, experience: true });
  });

  it('uses explicit homepageOrder, otherwise newest first with a stable id tie-break', () => {
    expect(selectHomepage(fixtureContent).publications.map((p) => p.id)).toEqual([
      'fx-long-title',
      'fx-preprint',
      'fx-paper-3',
      'fx-paper-4',
    ]);
    const items = [
      { id: 'b', d: '2024' },
      { id: 'a', d: '2024' },
      { id: 'c', d: '2025-03' },
    ];
    expect(pickForHomepage(items, 3, (i) => i.d).map((i) => i.id)).toEqual(['c', 'a', 'b']);
  });

  it('shows only author-selected projects on the real homepage', () => {
    expect(selectHomepage(content).projects.map((p) => p.id)).toEqual(['agentguard-chain', 'evoteam', 'pinnote']);
    expect(selectHomepage(content).more.projects).toBe(true);
  });

  it('hides empty sections, CV and their navigation when there is no material', () => {
    const home = selectHomepage(emptyContent);
    expect(home.publications).toEqual([]);
    expect(home.more).toEqual({ publications: false, projects: false, experience: false });
    expect(hasCv(emptyContent)).toBe(false);
    expect(navVisibility(emptyContent)).toEqual({ publications: false, projects: false, cv: false, blog: true });
  });

  it('hides the publications navigation for the real site, which has no papers yet', () => {
    expect(navVisibility(content)).toEqual({ publications: false, projects: true, cv: true, blog: true });
  });

  it('looks up details in the full collection, not only the homepage pick', () => {
    expect(findProjectDetail(fixtureContent, 'fx-project-a')).toBeDefined();
    expect(findProjectDetail(fixtureContent, 'fx-project-b')).toBeUndefined(); // exists, but no detail
    expect(allProjects(content)).toHaveLength(content.projects.length);
  });
});

describe('formatDate', () => {
  it('never invents missing months', () => {
    expect(formatDate('2026', 'zh')).toBe('2026');
    expect(formatDate('2026-06', 'zh')).toBe('2026.06');
    expect(formatDate('2026-06', 'en')).toBe('Jun 2026');
    expect(formatDate('2026-10-28', 'en')).toBe('28 Oct 2026');
  });
});
