import { Link } from 'react-router-dom';
import type { Project } from '@/content/types';
import { useSite } from '@/site/context';
import { entryAnchor } from '@/site/links';
import { projectPath } from '@/routing/paths';
import { useProjectMeta } from './ProjectCard';
import { MetaLine } from './MetaLine';
import { ResourceRow, resources } from './ResourceRow';

/** Compact text entry for the CV: name, type/role/date/status, summary, stack and links. */
export function ProjectEntry({ project }: { project: Project }) {
  const { locale, t } = useSite();
  const text = t.projects[project.id];
  const ui = t.ui;
  const detailHref = project.detail ? projectPath(locale, project.id) : undefined;
  const meta = useProjectMeta(project);

  return (
    <article id={entryAnchor('project', project.id)} className="cv-entry">
      <h3 className="t-h4" lang="en">
        {detailHref ? (
          <Link to={detailHref} className="plain-link text-fg">
            {project.name}
          </Link>
        ) : (
          project.name
        )}
      </h3>
      <MetaLine items={[ui.project.kind[project.kind], ...meta]} />
      {text?.summary && <p className="t-small measure mt-1.5">{text.summary}</p>}
      {project.techStack && project.techStack.length > 0 && (
        <p className="t-meta mt-1 text-muted">
          {ui.project.techStack}
          {ui.colon}
          {project.techStack.join(' · ')}
        </p>
      )}
      <ResourceRow
        items={resources([
          [ui.resources.detail, detailHref, true],
          [ui.resources.code, project.resources.code],
          [ui.resources.release, project.resources.release],
          [ui.resources.demo, project.resources.demo],
        ])}
      />
    </article>
  );
}
