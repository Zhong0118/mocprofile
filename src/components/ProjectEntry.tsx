import { Link } from 'react-router-dom';
import type { Project } from '@/content/types';
import { formatDate } from '@/content/selectors';
import { useSite } from '@/site/context';
import { entryAnchor } from '@/site/links';
import { projectPath } from '@/routing/paths';
import { MetaLine } from './MetaLine';
import { ResourceRow, resources } from './ResourceRow';

export function useProjectFacts(project: Project): string[] {
  const { locale, t } = useSite();
  const ui = t.ui.project;
  const text = t.projects[project.id];
  const period = project.end
    ? `${formatDate(project.start, locale)} – ${formatDate(project.end, locale)}`
    : ui.since(formatDate(project.start, locale));
  return [ui.kind[project.kind], text?.role, period, project.status && ui.status[project.status]].filter(
    (x): x is string => Boolean(x),
  );
}

export function projectResources(project: Project, labels: { [k: string]: string }, detailHref?: string) {
  return resources([
    [labels.detail, detailHref, true],
    [labels.code, project.resources.code],
    [labels.release, project.resources.release],
    [labels.demo, project.resources.demo],
    [labels.paper, project.resources.paper],
  ]);
}

/** Project entry: name, type/role/time/status, problem and what was built, stack, resources. */
export function ProjectEntry({ project, showImage = true }: { project: Project; showImage?: boolean }) {
  const { locale, t } = useSite();
  const text = t.projects[project.id];
  const ui = t.ui;
  const detailHref = project.detail ? projectPath(locale, project.id) : undefined;
  const facts = useProjectFacts(project);

  return (
    <article id={entryAnchor('project', project.id)} className="cv-entry flex flex-col gap-4 sm:flex-row sm:gap-8">
      <div className="min-w-0 flex-1">
        <h3 className="t-entry">
          {detailHref ? (
            <Link to={detailHref} className="plain-link">{project.name}</Link>
          ) : (
            project.name
          )}
        </h3>
        <MetaLine className="mt-1" items={facts} />
        {text?.summary && <p className="t-body measure mt-2">{text.summary}</p>}
        {project.techStack && project.techStack.length > 0 && (
          <p className="t-meta mt-1.5 text-muted">
            {ui.project.techStack}
            {ui.colon}
            {project.techStack.join(' · ')}
          </p>
        )}
        <ResourceRow className="mt-1" items={projectResources(project, ui.resources, detailHref)} />
      </div>
      {showImage && project.image && (
        <img
          src={project.image.src}
          width={220}
          height={138}
          alt={text?.imageAlt ?? ''}
          loading="lazy"
          decoding="async"
          className="figure-img aspect-[220/138] w-full max-w-[220px] shrink-0 object-cover sm:w-[220px]"
        />
      )}
    </article>
  );
}
