import { ArrowUpRight, BookOpen, FolderGit2 } from 'lucide-react';
import { formatDate } from '@/content/selectors';
import { useSite } from '@/site/context';

/** Public contact routes only (GitHub, blog). No form, no email unless one is published in person.email. */
export function ContactBlock() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui;
  const { person, blog } = bundle;
  const routes = [
    person.links.github && { href: person.links.github, label: ui.resources.github, detail: `github.com/${person.handle ?? ''}`, icon: FolderGit2 },
    person.links.blog && { href: person.links.blog, label: ui.resources.blog, detail: person.links.blog.replace(/^https:\/\//, ''), icon: BookOpen },
  ].filter(Boolean) as { href: string; label: string; detail: string; icon: typeof FolderGit2 }[];

  return (
    <div className="grid-layout items-start">
      <ul className="col-span-full grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
        {person.email && (
          <li>
            <a href={`mailto:${person.email}`} className="card card-interactive t-small break-url">
              {person.email}
            </a>
          </li>
        )}
        {routes.map((r) => (
          <li key={r.href}>
            <div className="card card-interactive flex-row items-center gap-3">
              <r.icon size={20} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-fg-2" />
              <div className="min-w-0 flex-1">
                <a href={r.href} className="card-link t-h4">
                  {r.label}
                </a>
                <p className="t-caption break-url text-muted" lang="en">
                  {r.detail}
                </p>
              </div>
              <ArrowUpRight size={18} strokeWidth={1.85} aria-hidden="true" className="shrink-0 text-muted" />
            </div>
          </li>
        ))}
      </ul>
      {blog && blog.items.length > 0 && (
        <div className="col-span-full lg:col-span-7">
          <h3 className="t-meta font-semibold text-fg-2">{ui.blog.title}</h3>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {blog.items.map((post) => (
              <li key={post.url} className="py-3">
                <a href={post.url} className="plain-link t-small font-medium text-fg">
                  {post.title}
                </a>
                <p className="t-caption mt-0.5 text-muted">
                  <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                  {post.description && <> · {post.description}</>}
                </p>
              </li>
            ))}
          </ul>
          <p className="t-caption mt-2 text-muted">{ui.blog.snapshot(formatDate(blog.retrievedAt, locale))}</p>
        </div>
      )}
    </div>
  );
}
