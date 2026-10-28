import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { directionsOfProject, findProjectDetail, relatedProjects } from '@/content/selectors';
import { useSite } from '@/site/context';
import { useHydrated } from '@/site/hydration';
import { lastListUrl } from '@/site/nav-memory';
import { captureShared } from '@/site/shared-element';
import { projectsPath } from '@/routing/paths';
import { useProjectMeta, ProjectCard } from '@/components/ProjectCard';
import { MetaLine } from '@/components/MetaLine';
import { TagList } from '@/components/ui';
import { BackLink, DetailSections } from './PageParts';
import NotFoundPage from './NotFoundPage';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function ProjectDetailPage() {
  const { id = '' } = useParams();
  const { bundle } = useSite();
  const project = findProjectDetail(bundle, id);
  if (!project) return <NotFoundPage />;
  return <ProjectCase id={project.id} />;
}

/** Highlights the table-of-contents entry for the section being read. */
function useCurrentSection(ids: string[]) {
  const [current, setCurrent] = useState<string | undefined>(undefined);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) + 40;
      let found: string | undefined;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) found = id;
      }
      setCurrent(found ?? ids[0]);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ids.join()]);
  return current;
}

function ProjectCase({ id }: { id: string }) {
  const { bundle, locale, t } = useSite();
  const project = findProjectDetail(bundle, id)!;
  const text = t.projects[id];
  const ui = t.ui;
  const meta = useProjectMeta(project);
  const sections = text.sections ?? [];
  const current = useCurrentSection(sections.map((s) => s.id));
  const related = relatedProjects(bundle, id);
  const directions = directionsOfProject(bundle, id);
  const hydrated = useHydrated();
  // The prerendered link points at the plain directory; after hydration it carries the last filters.
  const back = (hydrated && lastListUrl('projects')) || projectsPath(locale);
  // Before the page is removed (back, or any link away), remember the header's box so the matching
  // card on the next page can settle from it. Layout-effect cleanups run while the DOM is still here.
  const headerRef = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = headerRef.current;
    return () => captureShared(id, el);
  }, [id]);

  return (
    <article className="page-wrap">
      <div className="page-top">
        <BackLink to={back} label={ui.detail.backToProjects} />
      </div>

      <header ref={headerRef} data-shared-id={project.id} data-shared-role="detail" className="card card-surface mt-3">
        <p className="t-eyebrow">
          {[ui.project.kind[project.kind], ...directions.map((d) => t.directions[d.id].label)].join(' · ')}
        </p>
        <h1 className="t-h1 mt-2" lang="en">
          {project.name}
        </h1>
        <MetaLine className="mt-2" items={meta} />
        <p className="t-lead measure mt-4">{text.summary}</p>
        {text.roleNote && (
          <p className="t-caption measure mt-3 text-muted">
            {ui.project.role}
            {ui.colon}
            {text.roleNote}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <TagList items={project.techStack ?? []} max={6} />
          <div className="flex flex-wrap gap-2">
            {project.resources.code && (
              <a href={project.resources.code} className="btn btn-primary print-url" data-print-url={project.resources.code}>
                {ui.resources.viewCode}
                <ArrowUpRight size={18} strokeWidth={1.85} aria-hidden="true" />
              </a>
            )}
            {project.resources.release && (
              <a href={project.resources.release} className="btn btn-secondary btn-hero">
                {ui.resources.getRelease}
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="grid-layout mt-10 lg:mt-12">
        {sections.length > 1 && (
          <nav aria-label={ui.detail.contents} className="col-span-full hidden lg:col-span-3 lg:block">
            <div className="toc">
              <p className="t-caption mb-2 font-semibold text-fg-2">{ui.detail.contents}</p>
              <ol>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} aria-current={current === s.id ? 'true' : undefined}>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}
        <div className="col-span-full min-w-0 lg:col-span-9 lg:max-w-[52rem]">
          <DetailSections sections={sections} />
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="module mt-12 border-t border-border">
          <h2 id="related-title" className="t-h2 mb-5">
            {ui.detail.related}
          </h2>
          <ul className="grid-layout">
            {related.map((p) => (
              <li key={p.id} className="col-span-full md:col-span-4 lg:col-span-4">
                <ProjectCard project={p} anchor={false} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
