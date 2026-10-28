import { useParams } from 'react-router-dom';
import { findProjectDetail } from '@/content/selectors';
import { useSite } from '@/site/context';
import { homePath } from '@/routing/paths';
import { projectResources, useProjectFacts } from '@/components/ProjectEntry';
import { ResourceRow } from '@/components/ResourceRow';
import { MetaLine } from '@/components/MetaLine';
import { BackLink, DetailSections } from './DetailParts';
import NotFoundPage from './NotFoundPage';

export default function ProjectDetailPage() {
  const { id = '' } = useParams();
  const { bundle } = useSite();
  const project = findProjectDetail(bundle, id);
  if (!project) return <NotFoundPage />;
  return <ProjectDetail id={project.id} />;
}

function ProjectDetail({ id }: { id: string }) {
  const { bundle, locale, t } = useSite();
  const project = findProjectDetail(bundle, id)!;
  const text = t.projects[id];
  const ui = t.ui;
  const facts = useProjectFacts(project);

  return (
    <article className="shell">
      <div className="page-top detail-measure">
        <BackLink to={`${homePath(locale)}#projects`} label={ui.detail.backToProjects} />
        <h1 className="t-detail-h1 mt-3">{project.name}</h1>
        <MetaLine className="mt-2" items={facts} />
        {project.techStack && (
          <p className="t-meta text-muted">
            {ui.project.techStack}
            {ui.colon}
            {project.techStack.join(' · ')}
          </p>
        )}
        <ResourceRow className="mt-2" items={projectResources(project, ui.resources)} />
        <p className="t-detail-body mt-6">{text.summary}</p>
        {project.image && (
          <figure className="mt-8">
            <img
              src={project.image.src}
              width={project.image.width}
              height={project.image.height}
              alt={text.imageAlt ?? ''}
              loading="lazy"
              className="figure-img h-auto w-full"
            />
          </figure>
        )}
        {text.sections && <DetailSections sections={text.sections} />}
      </div>
    </article>
  );
}
