import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/content/types';
import { formatDate, projectDateLabel } from '@/content/selectors';
import { cn } from '@/lib/utils';
import { useSite } from '@/site/context';
import { entryAnchor, projectActions } from '@/site/links';
import { captureShared } from '@/site/shared-element';
import { MetaLine } from './MetaLine';
import { TagList } from './ui';

export type ProjectCardVariant = 'feature' | 'side' | 'grid' | 'list';

export function useProjectMeta(project: Project): string[] {
  const { locale, t } = useSite();
  const text = t.projects[project.id];
  return [text?.role, projectDateLabel(project, locale, t), project.status && t.ui.project.status[project.status]].filter(
    (x): x is string => Boolean(x),
  );
}

/**
 * Project card. The title link covers the whole card (one main action); code / release links sit
 * above it as separate actions, so links are never nested.
 */
export function ProjectCard({
  project,
  variant = 'grid',
  headingLevel = 3,
  anchor = true,
  className,
}: {
  project: Project;
  variant?: ProjectCardVariant;
  headingLevel?: 2 | 3;
  anchor?: boolean;
  className?: string;
}) {
  const { locale, t } = useSite();
  const ui = t.ui;
  const text = t.projects[project.id];
  const meta = useProjectMeta(project);
  const { main, secondary } = projectActions(project, locale, ui);
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const eyebrow = variant === 'feature' ? `${ui.project.featured} · ${ui.project.kind[project.kind]}` : ui.project.kind[project.kind];
  const list = variant === 'list';
  const implemented = text?.sections?.find((s) => s.kind === 'implemented' && s.list);

  const onMainClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (main?.internal) captureShared(project.id, e.currentTarget.closest('article'));
  };

  const title = main ? (
    main.internal ? (
      <Link to={main.href} className="card-link" onClick={onMainClick}>
        {project.name}
      </Link>
    ) : (
      <a href={main.href} className="card-link">
        {project.name}
      </a>
    )
  ) : (
    project.name
  );

  return (
    <article
      id={anchor ? entryAnchor('project', project.id) : undefined}
      data-shared-id={project.id}
      data-shared-role="card"
      className={cn(
        'card card-interactive h-full',
        variant === 'feature' && 'card-surface',
        list && 'md:grid md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] md:items-start md:gap-6',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="t-eyebrow">{eyebrow}</p>
        <H className={cn('mt-1.5', variant === 'feature' ? 't-h2' : 't-h3')} lang="en">
          {title}
        </H>
        <MetaLine className="t-caption mt-1" items={meta} />
      </div>

      <div className={cn('min-w-0', list ? 'mt-3 md:mt-0' : 'mt-3')}>
        <p className={variant === 'feature' ? 't-body text-fg-2' : 't-small text-fg-2'}>{text?.summary}</p>
        {variant === 'feature' && implemented?.list && (
          <div className="mt-5">
            <p className="t-caption flex flex-wrap items-center gap-2 text-muted">
              <span className="badge">{ui.detail.sectionKind.implemented}</span>
              {implemented.source && ui.detail.source(implemented.source.label, formatDate(implemented.source.retrievedAt, locale))}
            </p>
            <ul className="t-small mt-2.5 grid gap-x-6 gap-y-1.5 text-fg-2 md:grid-cols-2">
              {implemented.list.slice(0, 4).map((item) => (
                <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-accent">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {variant === 'feature' && text?.schematic && (
          <figure className="mt-5">
            <figcaption className="t-caption mb-2.5 flex flex-wrap items-center gap-2 text-muted">
              <span className="badge badge-neutral">{ui.project.schematic}</span>
              {text.schematic.caption}
            </figcaption>
            <ol className="schematic">
              {text.schematic.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </figure>
        )}
      </div>

      <div className={cn('flex flex-wrap items-center justify-between gap-x-4 gap-y-3', list ? 'mt-4 md:mt-0 md:flex-col md:items-end' : 'mt-auto pt-5')}>
        <TagList items={project.techStack ?? []} max={list ? 4 : 3} />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {main && (
            <span className="text-action pointer-events-none" aria-hidden="true">
              {main.label}
              {main.internal ? (
                <ArrowRight className="arrow" size={16} strokeWidth={1.85} />
              ) : (
                <ArrowUpRight size={16} strokeWidth={1.85} />
              )}
            </span>
          )}
          {secondary.map((a) => (
            <a key={a.href} href={a.href} className="card-action plain-link t-meta inline-flex min-h-11 items-center text-fg-2">
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
