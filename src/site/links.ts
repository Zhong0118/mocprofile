import type { ContentBundle, Locale } from '@/content/types';
import { hasCv, selectHomepage } from '@/content/selectors';
import { cvPath, homePath, projectPath, publicationPath } from '@/routing/paths';

export interface Target {
  href: string;
  internal: boolean;
}

export const entryAnchor = (kind: 'project' | 'publication', id: string) => `${kind}-${id}`;

/** Best on-site target for a project: detail page, homepage entry, CV entry, then the repository. */
export function projectTarget(bundle: ContentBundle, locale: Locale, id: string): Target | undefined {
  const project = bundle.projects.find((p) => p.id === id);
  if (!project) return undefined;
  if (project.detail) return { href: projectPath(locale, id), internal: true };
  if (selectHomepage(bundle).projects.some((p) => p.id === id)) {
    return { href: `${homePath(locale)}#${entryAnchor('project', id)}`, internal: true };
  }
  if (hasCv(bundle)) return { href: `${cvPath(locale)}#${entryAnchor('project', id)}`, internal: true };
  return project.resources.code ? { href: project.resources.code, internal: false } : undefined;
}

export function publicationTarget(bundle: ContentBundle, locale: Locale, id: string): Target | undefined {
  const pub = bundle.publications.find((p) => p.id === id);
  if (!pub) return undefined;
  if (pub.detail) return { href: publicationPath(locale, id), internal: true };
  // The title points at the official paper page; PDF, DOI and code stay in the resource row.
  return pub.resources.paper ? { href: pub.resources.paper, internal: false } : undefined;
}
