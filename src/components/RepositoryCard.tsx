import { Link } from 'react-router-dom';
import { ArrowUpRight, GitBranch } from 'lucide-react';
import type { Repository } from '@/content/types';
import { formatDate } from '@/content/selectors';
import { useSite } from '@/site/context';
import { entryAnchor, projectTarget } from '@/site/links';
import { MetaLine } from './MetaLine';
import { CopyButton, TagList } from './ui';

/** Repository card: name, summary, languages and verified facts. No stars, forks or traffic. */
export function RepositoryCard({ repo }: { repo: Repository }) {
  const { bundle, locale, t } = useSite();
  const ui = t.ui.repository;
  const text = t.repositories[repo.id];
  const facts = [
    ui.created(formatDate(repo.createdAt, locale)),
    repo.license && `${ui.license} ${repo.license}`,
    repo.archived && ui.archived,
    repo.fork && ui.fork,
  ].filter((x): x is string => Boolean(x));

  return (
    <article id={entryAnchor('repository', repo.id)} className="card card-interactive h-full">
      <p className="t-caption flex items-center gap-1.5 text-muted">
        <GitBranch size={14} strokeWidth={1.85} aria-hidden="true" />
        <span lang="en">{repo.owner}</span>
      </p>
      <h3 className="t-h3 mt-1 break-all" lang="en">
        <a href={repo.url} className="card-link">
          {repo.name}
        </a>
      </h3>
      <p className="t-small mt-2 text-fg-2">{text?.summary}</p>
      <MetaLine className="t-caption mt-2" items={facts} />
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-4">
        <TagList items={repo.languages} />
        <div className="flex items-center gap-1">
          {repo.release && (
            <a href={repo.release} className="card-action plain-link t-meta inline-flex min-h-11 items-center gap-1 px-1 text-fg-2">
              {t.ui.resources.release}
              <ArrowUpRight size={14} strokeWidth={1.85} aria-hidden="true" />
            </a>
          )}
          <CopyButton value={repo.url} label={ui.copyUrl} copiedLabel={ui.copied} failedLabel={ui.copyFailed} />
        </div>
      </div>
      {repo.projectIds.length > 0 && (
        <p className="t-caption mt-2 text-muted">
          {ui.projects}
          {t.ui.colon}
          {repo.projectIds.map((pid, i) => {
            const target = projectTarget(bundle, locale, pid);
            const name = bundle.projects.find((p) => p.id === pid)?.name;
            return (
              <span key={pid}>
                {i > 0 && ', '}
                {target ? (
                  <Link to={target.href} className="card-action prose-link" lang="en">
                    {name}
                  </Link>
                ) : (
                  name
                )}
              </span>
            );
          })}
        </p>
      )}
    </article>
  );
}
