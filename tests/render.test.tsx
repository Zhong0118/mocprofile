import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '@/App';
import { content } from '@/content';
import type { ContentBundle, LocaleContent } from '@/content/types';
import { validateContent } from '@/content/validate';
import { emptyContent, fixtureContent } from '@/fixtures/content';

const render = (bundle: ContentBundle, url: string) =>
  renderToString(
    <StaticRouter location={url}>
      <App bundle={bundle} />
    </StaticRouter>,
  );
const count = (html: string, re: RegExp) => (html.match(re) ?? []).length;
const MODULE_ANCHORS = ['about', 'research', 'projects', 'publications', 'skills', 'github', 'experience', 'awards', 'cv', 'contact'];

describe('server rendering', () => {
  it('renders the homepage with one h1, all ten modules and no content hidden until JS runs', () => {
    const html = render(content, '/');
    expect(count(html, /<h1[\s>]/g)).toBe(1);
    expect(html).toContain('mocX');
    for (const id of MODULE_ANCHORS) expect(html).toContain(`id="${id}"`);
    expect(html).not.toMatch(/opacity:\s*0[;"]/);
    // Empty modules stay, with the compact empty state.
    expect(count(html, /暂未列出公开条目/g)).toBe(3);
  });

  it('shows the same modules for a bundle with no entries at all', () => {
    const html = render(emptyContent, '/');
    for (const id of MODULE_ANCHORS) expect(html).toContain(`id="${id}"`);
    expect(html).toMatch(/href="\/projects\/"/);
    expect(html).toMatch(/href="\/publications\/"/);
    expect(html).toMatch(/href="\/cv\/"/);
  });

  it('features three projects, the first with a labelled schematic, and no nested links', () => {
    const html = render(content, '/');
    expect(html).toContain('AgentGuard-Chain');
    expect(html).toContain('EvoTeam');
    expect(html).toContain('PinNote');
    expect(html).toContain('示意');
    for (const card of html.match(/<article[^>]*data-shared-role="card"[\s\S]*?<\/article>/g) ?? []) {
      expect(card).not.toMatch(/<a [^>]*>(?:(?!<\/a>)[\s\S])*<a /);
    }
  });

  it('renders English text under /en/', () => {
    const html = render(content, '/en/');
    expect(html).toContain('Research directions');
    expect(html).toContain('No public entries listed');
    expect(html).not.toContain('研究方向');
  });

  it('renders the project directory with every project and the default filter state', () => {
    const html = render(content, '/projects/');
    for (const p of content.projects) expect(html).toContain(p.name);
    expect(html).toContain('显示 8 / 8 项');
    expect(html).toContain('aria-checked="true"');
  });

  it('renders an empty publications page with the empty state, not a no-match state', () => {
    const html = render(content, '/publications/');
    expect(html).toContain('暂未列出公开条目');
    expect(html).not.toContain('没有符合条件的条目');
  });

  it('renders repositories without popularity numbers and with the data source', () => {
    const html = render(content, '/en/repositories/');
    for (const r of content.repositories) expect(html).toContain(r.name);
    expect(/\d[\d,.k]*\s*(stars?|forks?)\b|★/i.test(html)).toBe(false);
    expect(html).toContain('read on 28 Oct 2026');
  });

  it('renders case studies with implemented / planned labels and README sources', () => {
    const html = render(content, '/projects/evoteam/');
    expect(html).toContain('已实现');
    expect(html).toContain('未完成 / 计划中');
    expect(html).toContain('来源：仓库 README，查阅于 2026 年 10 月 28 日');
    expect(html).toContain('本页目录');
    const agentguard = render(content, '/projects/agentguard-chain/');
    expect(agentguard).toContain('本站没有重新运行验证');
  });

  it('renders the about page anchors and the CV with every project', () => {
    const about = render(content, '/about/');
    for (const id of ['skills', 'education', 'experience', 'awards', 'contact']) expect(about).toContain(`id="${id}"`);
    const cv = render(content, '/cv/');
    for (const p of content.projects) expect(cv).toContain(p.name);
    expect(cv).toContain('print-hide');
    expect(cv).not.toContain('下载 PDF');
  });

  it('shows a PDF download only when a PDF exists, and labels another-language PDF honestly', () => {
    const en = render(fixtureContent, '/en/cv/');
    expect(en).toContain('Download Chinese PDF');
    expect(en).not.toContain('>Download PDF');
  });

  it('renders bibliography entries in the original author order and marks the owner by id', () => {
    const html = render(fixtureContent, '/en/publications/');
    const first = html.indexOf('Coauthor Number1 Longsurname');
    const owner = html.indexOf('<span class="font-semibold text-fg">Fixture Person</span>');
    const fourth = html.indexOf('Coauthor Number4 Longsurname');
    expect(first).toBeGreaterThan(-1);
    expect(owner).toBeGreaterThan(first);
    expect(fourth).toBeGreaterThan(owner);
  });

  it('renders the not-found view for unknown, detail-less or dev-only paths', () => {
    expect(render(content, '/projects/pinnote/')).toContain('页面不存在');
    expect(render(content, '/en/papers/paper-001/')).toContain('Page not found');
  });
});

describe('isolated content intake (in memory, nothing written to disk)', () => {
  // One publication, one experience and one award added to a copy of the real bundle, as the
  // intake templates describe. The production bundle itself stays unchanged.
  const withLocale = (l: LocaleContent, lang: 'zh' | 'en'): LocaleContent => ({
    ...l,
    publications: { 'intake-paper': { summary: lang === 'zh' ? '测试摘要句。' : 'Intake test summary.' } },
    experience: { 'intake-edu': { role: lang === 'zh' ? '测试身份' : 'Intake role', organization: 'Intake University' } },
    awards: { 'intake-award': { title: lang === 'zh' ? '测试奖项' : 'Intake award' } },
  });
  const bundle: ContentBundle = {
    ...content,
    publications: [
      {
        id: 'intake-paper',
        originalTitle: 'Intake Test Paper Title',
        titleLang: 'en',
        authors: [{ name: 'mocX', personId: 'zhong0118' }, { name: 'Coauthor' }],
        year: 2026,
        type: 'conference',
        publicationStatus: 'preprint',
        arxiv: '2610.00001',
        resources: {},
      },
    ],
    experience: [{ id: 'intake-edu', kind: 'education', start: '2024-09', end: 'present' }],
    awards: [{ id: 'intake-award', date: '2026-05', participation: 'team' }],
    locales: { zh: withLocale(content.locales.zh, 'zh'), en: withLocale(content.locales.en, 'en') },
  };

  it('passes validation', () => {
    expect(validateContent(bundle)).toEqual([]);
  });

  it('switches the modules from empty state to entries on the homepage and CV', () => {
    const home = render(bundle, '/');
    expect(home).toContain('Intake Test Paper Title');
    expect(home).toContain('测试身份');
    expect(home).toContain('测试奖项');
    expect(count(home, /暂未列出公开条目/g)).toBe(0);
    const cv = render(bundle, '/en/cv/');
    expect(cv).toContain('Intake Test Paper Title');
    expect(cv).toContain('Intake award');
  });

  it('leaves the production bundle untouched', () => {
    expect(content.publications).toEqual([]);
    expect(content.experience).toEqual([]);
    expect(content.awards).toEqual([]);
  });
});
