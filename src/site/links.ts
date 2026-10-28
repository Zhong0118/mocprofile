import type { ContentBundle, Locale, Project, UiText } from '@/content/types';
import { projectPath, projectsPath, publicationPath } from '@/routing/paths';

export interface Target {
  href: string;
  internal: boolean;
}

export const entryAnchor = (kind: 'project' | 'publication' | 'repository', id: string) => `${kind}-${id}`;

/** Best on-site target for a project: its case study, otherwise its entry in the project directory. */
export function projectTarget(bundle: ContentBundle, locale: Locale, id: string): Target | undefined {
  const project = bundle.projects.find((p) => p.id === id);
  if (!project) return undefined;
  if (project.detail) return { href: projectPath(locale, id), internal: true };
  return { href: `${projectsPath(locale)}#${entryAnchor('project', id)}`, internal: true };
}

/**
 * The main action of a project card: the case study when there is one, otherwise the release page
 * for released tools, otherwise the code. Secondary actions never repeat the main one.
 */
export function projectActions(project: Project, locale: Locale, ui: UiText) {
  const main: (Target & { label: string }) | undefined = project.detail
    ? { href: projectPath(locale, project.id), internal: true, label: ui.resources.readCase }
    : project.resources.release
      ? { href: project.resources.release, internal: false, label: ui.resources.getRelease }
      : project.resources.code
        ? { href: project.resources.code, internal: false, label: ui.resources.viewCode }
        : undefined;
  const secondary = [
    { href: project.resources.code, label: ui.resources.code },
    { href: project.resources.release, label: ui.resources.release },
    { href: project.resources.demo, label: ui.resources.demo },
    { href: project.resources.paper, label: ui.resources.paper },
  ].filter((a): a is { href: string; label: string } => Boolean(a.href) && a.href !== main?.href);
  return { main, secondary };
}

export function publicationTarget(bundle: ContentBundle, locale: Locale, id: string): Target | undefined {
  const pub = bundle.publications.find((p) => p.id === id);
  if (!pub) return undefined;
  if (pub.detail) return { href: publicationPath(locale, id), internal: true };
  // The title points at the official paper page; PDF, DOI and code stay in the resource row.
  return pub.resources.paper ? { href: pub.resources.paper, internal: false } : undefined;
}
