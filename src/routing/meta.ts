import type { ContentBundle, Locale } from '@/content/types';
import { findProjectDetail, findPublicationDetail } from '@/content/selectors';
import type { RouteEntry } from './manifest';

export interface PageMeta {
  lang: 'zh-CN' | 'en';
  title: string;
  description: string;
  /** Absolute canonical URL; undefined for pages that must not be indexed (404). */
  canonical?: string;
  alternates: { hreflang: string; href: string }[];
  ogType: 'website' | 'profile' | 'article';
  jsonLd?: object;
}

export const htmlLang = (locale: Locale): PageMeta['lang'] => (locale === 'zh' ? 'zh-CN' : 'en');

function firstSentence(text: string): string {
  const match = text.match(/^.+?[。．.!?！？](?=\s|$)/u);
  return (match ? match[0] : text).trim();
}

export function getPageMeta(bundle: ContentBundle, entry: RouteEntry | undefined, locale: Locale): PageMeta {
  const { ui } = bundle.locales[locale];
  const name = bundle.person.displayName;
  const lang = htmlLang(locale);

  if (!entry) {
    return { lang, title: `${ui.notFound.title} · ${name}`, description: ui.notFound.description, alternates: [], ogType: 'website' };
  }

  const abs = (path: string) => `${bundle.site.url}${path}`;
  const alternates = [
    { hreflang: 'zh-CN', href: abs(entry.alternates.zh) },
    { hreflang: 'en', href: abs(entry.alternates.en) },
    { hreflang: 'x-default', href: abs(entry.alternates.zh) },
  ];
  const base = { lang, canonical: abs(entry.path), alternates };

  switch (entry.kind) {
    case 'home': {
      const { links } = bundle.person;
      const sameAs = [links.github, links.blog, links.scholar, links.orcid].filter(Boolean);
      return {
        ...base,
        title: ui.meta.homeTitle(name, bundle.person.handle),
        description: ui.meta.homeDescription,
        ogType: 'profile',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name,
          ...(bundle.person.handle ? { alternateName: bundle.person.handle } : {}),
          url: abs(entry.path),
          ...(sameAs.length ? { sameAs } : {}),
        },
      };
    }
    case 'about':
      return { ...base, title: ui.meta.pageTitle(ui.modules.about, name), description: ui.meta.aboutDescription, ogType: 'profile' };
    case 'projects':
      return { ...base, title: ui.meta.pageTitle(ui.modules.projects, name), description: ui.meta.projectsDescription, ogType: 'website' };
    case 'publications':
      return {
        ...base,
        title: ui.meta.pageTitle(ui.modules.publications, name),
        description: ui.meta.publicationsDescription,
        ogType: 'website',
      };
    case 'repositories':
      return {
        ...base,
        title: ui.meta.pageTitle(ui.modules.repositories, name),
        description: ui.meta.repositoriesDescription,
        ogType: 'website',
      };
    case 'cv':
      return { ...base, title: ui.meta.cvTitle(name), description: ui.meta.cvDescription(name), ogType: 'website' };
    case 'project': {
      const project = findProjectDetail(bundle, entry.id!)!;
      const text = bundle.locales[locale].projects[project.id];
      return {
        ...base,
        title: `${project.name} · ${ui.modules.projects} · ${name}`,
        description: firstSentence(text.summary),
        ogType: 'article',
      };
    }
    case 'publication': {
      const pub = findPublicationDetail(bundle, entry.id!)!;
      const text = bundle.locales[locale].publications[pub.id];
      return {
        ...base,
        title: `${pub.originalTitle} · ${name}`,
        description: firstSentence(text.summary),
        ogType: 'article',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ScholarlyArticle',
          headline: pub.originalTitle,
          author: pub.authors.map((a) => ({ '@type': 'Person', name: a.name })),
          ...(pub.publicationStatus === 'published' ? { datePublished: pub.date ?? String(pub.year) } : {}),
          ...(pub.doi ? { sameAs: `https://doi.org/${pub.doi}` } : {}),
          url: abs(entry.path),
        },
      };
    }
  }
}
