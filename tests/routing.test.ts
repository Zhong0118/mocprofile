import { describe, expect, it } from 'vitest';
import { content } from '@/content';
import { buildRouteManifest, matchRoute } from '@/routing/manifest';
import { getPageMeta } from '@/routing/meta';
import { localeFromPath, switchLocalePath } from '@/routing/paths';
import { emptyContent } from '@/fixtures/content';

describe('route manifest', () => {
  it('lists exactly the real public pages', () => {
    expect(buildRouteManifest(content).map((r) => r.path)).toEqual([
      '/',
      '/en/',
      '/cv/',
      '/en/cv/',
      '/projects/agentguard-chain/',
      '/en/projects/agentguard-chain/',
      '/projects/evoteam/',
      '/en/projects/evoteam/',
    ]);
  });

  it('drops the CV route when there is no substantive material', () => {
    expect(buildRouteManifest(emptyContent).map((r) => r.path)).toEqual(['/', '/en/']);
  });

  it('removes the old template routes', () => {
    for (const p of ['/papers/paper-001/', '/projects/project-001/', '/projects/pinnote/']) {
      expect(matchRoute(content, p)).toBeUndefined();
    }
  });

  it('matches paths with or without a trailing slash', () => {
    expect(matchRoute(content, '/en/cv')?.path).toBe('/en/cv/');
    expect(matchRoute(content, '/projects/evoteam')?.kind).toBe('project');
  });
});

describe('locale from URL', () => {
  it('derives the language from the path only', () => {
    expect(localeFromPath('/')).toBe('zh');
    expect(localeFromPath('/en')).toBe('en');
    expect(localeFromPath('/en/cv/')).toBe('en');
    expect(localeFromPath('/english/')).toBe('zh');
    expect(switchLocalePath('/projects/evoteam/', 'en')).toBe('/en/projects/evoteam/');
    expect(switchLocalePath('/en/projects/evoteam/', 'zh')).toBe('/projects/evoteam/');
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
