import { describe, expect, it } from 'vitest';
import { content } from '@/content';
import { buildRouteManifest, matchRoute } from '@/routing/manifest';
import { getPageMeta } from '@/routing/meta';
import { localeFromPath, switchLocalePath } from '@/routing/paths';
import { emptyContent } from '@/fixtures/content';

const paths = (b = content) => buildRouteManifest(b).map((r) => r.path);

describe('route manifest', () => {
  it('lists the index pages in both languages, independent of how much content they have', () => {
    for (const p of ['/', '/about/', '/projects/', '/publications/', '/repositories/', '/cv/']) {
      expect(paths()).toContain(p);
      expect(paths()).toContain(p === '/' ? '/en/' : `/en${p}`);
    }
    // Empty collections still get their index pages (with an empty state).
    expect(paths(emptyContent)).toContain('/publications/');
    expect(paths(emptyContent)).toContain('/en/repositories/');
  });

  it('adds a detail page only for entries with detail material', () => {
    const details = paths().filter((p) => /\/(projects|papers)\/[^/]+\/$/.test(p));
    const expected = content.projects.filter((p) => p.detail).flatMap((p) => [`/projects/${p.id}/`, `/en/projects/${p.id}/`]);
    expect(details.sort()).toEqual(expected.sort());
  });

  it('has 16 public routes for the current content', () => {
    expect(paths()).toHaveLength(16);
    expect(new Set(paths()).size).toBe(16);
  });

  it('drops index pages only when the module is switched off', () => {
    const off = { ...content, site: { ...content.site, modules: { ...content.site.modules, repositories: { enabled: false } } } };
    expect(paths(off)).not.toContain('/repositories/');
    expect(paths(off)).toContain('/projects/');
  });

  it('removes the old template routes', () => {
    for (const p of ['/papers/paper-001/', '/projects/project-001/', '/projects/pinnote/', '/cv.pdf', '/__content-review__/']) {
      expect(matchRoute(content, p)).toBeUndefined();
    }
  });

  it('matches paths with or without a trailing slash', () => {
    expect(matchRoute(content, '/en/cv')?.path).toBe('/en/cv/');
    expect(matchRoute(content, '/projects/evoteam')?.kind).toBe('project');
    expect(matchRoute(content, '/repositories')?.kind).toBe('repositories');
  });
});

describe('locale from URL', () => {
  it('derives the language from the path only and keeps filters and anchors when switching', () => {
    expect(localeFromPath('/')).toBe('zh');
    expect(localeFromPath('/en')).toBe('en');
    expect(localeFromPath('/en/cv/')).toBe('en');
    expect(localeFromPath('/english/')).toBe('zh');
    expect(switchLocalePath('/projects/evoteam/', 'en')).toBe('/en/projects/evoteam/');
    expect(switchLocalePath('/en/projects/', 'zh', '?type=tool&q=rust', '')).toBe('/projects/?type=tool&q=rust');
    expect(switchLocalePath('/about/', 'en', '', '#skills')).toBe('/en/about/#skills');
  });
});

describe('metadata', () => {
  it('gives every page a unique title, self canonical and both alternates', () => {
    const manifest = buildRouteManifest(content);
    const metas = manifest.map((e) => getPageMeta(content, e, e.locale));
    expect(new Set(metas.map((m) => m.title)).size).toBe(manifest.length);
    manifest.forEach((e, i) => {
      expect(metas[i].canonical).toBe(`https://mocprofile.vercel.app${e.path}`);
      expect(metas[i].lang).toBe(e.locale === 'zh' ? 'zh-CN' : 'en');
      expect(metas[i].alternates.map((a) => a.hreflang)).toEqual(['zh-CN', 'en', 'x-default']);
      expect(metas[i].description.length).toBeGreaterThan(10);
    });
  });

  it('only states confirmed facts in JSON-LD', () => {
    const home = getPageMeta(content, buildRouteManifest(content)[0], 'zh');
    expect(home.jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'mocX',
      alternateName: 'Zhong0118',
      url: 'https://mocprofile.vercel.app/',
      sameAs: ['https://github.com/Zhong0118', 'https://moclab.top'],
    });
  });
});
