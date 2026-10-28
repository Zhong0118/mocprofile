import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '@/App';
import { content } from '@/content';
import type { ContentBundle } from '@/content/types';
import { emptyContent, fixtureContent } from '@/fixtures/content';

const render = (bundle: ContentBundle, url: string) =>
  renderToString(
    <StaticRouter location={url}>
      <App bundle={bundle} />
    </StaticRouter>,
  );
const count = (html: string, re: RegExp) => (html.match(re) ?? []).length;

describe('server rendering', () => {
  it('renders the real homepage with one h1 and no hidden-until-scroll content', () => {
    const html = render(content, '/');
    expect(count(html, /<h1[\s>]/g)).toBe(1);
    expect(html).toContain('mocX');
    expect(html).toContain('AgentGuard-Chain');
    expect(html).not.toContain('opacity:0');
    expect(html).not.toContain('id="publications"');
    expect(html).not.toContain('id="experience"');
  });

  it('renders English text under /en/', () => {
    const html = render(content, '/en/');
    expect(html).toContain('Selected projects');
    expect(html).not.toContain('精选项目');
  });

  it('shows navigation only for sections that exist', () => {
    const html = render(emptyContent, '/');
    expect(html).not.toMatch(/href="\/#projects"/);
    expect(html).not.toMatch(/href="\/cv\/"/);
    expect(html).not.toContain('在线 CV');
  });

  it('renders bibliography entries in the original author order and marks the owner by id', () => {
    const html = render(fixtureContent, '/en/');
    const first = html.indexOf('Coauthor Number1 Longsurname');
    const owner = html.indexOf('<span class="font-semibold text-fg">Fixture Person</span>');
    const fourth = html.indexOf('Coauthor Number4 Longsurname');
    expect(first).toBeGreaterThan(-1);
    expect(owner).toBeGreaterThan(first);
    expect(fourth).toBeGreaterThan(owner);
    expect(html).toContain('<details class="disclosure t-meta">');
  });

  it('shows a PDF download only when a PDF exists, and labels another-language PDF honestly', () => {
    expect(render(content, '/cv/')).not.toContain('下载 PDF');
    const en = render(fixtureContent, '/en/cv/');
    expect(en).toContain('Download Chinese PDF');
    expect(en).not.toContain('>Download PDF');
  });

  it('renders the full CV collections, including homepage items', () => {
    const html = render(content, '/cv/');
    for (const p of content.projects) expect(html).toContain(p.name);
  });

  it('renders the not-found view for unknown or detail-less ids', () => {
    expect(render(content, '/projects/pinnote/')).toContain('页面不存在');
    expect(render(content, '/en/papers/paper-001/')).toContain('Page not found');
  });
});
