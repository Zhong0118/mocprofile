import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import type { DetailSection } from '@/content/types';
import { formatDate } from '@/content/selectors';
import { useSite } from '@/site/context';
import { originOf } from '@/site/nav-memory';

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="page-top">
      {eyebrow && <p className="t-eyebrow mb-2">{eyebrow}</p>}
      <h1 className="t-h1">{title}</h1>
      {lead && <p className="t-lead measure mt-3">{lead}</p>}
      {children}
    </header>
  );
}

/** Filter result without matches. Different from the empty state, which means "nothing listed". */
export function NoMatch({ onClear }: { onClear: () => void }) {
  const { t } = useSite();
  const ui = t.ui.noMatch;
  return (
    <div className="empty-state flex-col items-start gap-2 py-6" role="status">
      <p className="flex items-center gap-2 font-medium text-fg">
        <SearchX size={18} strokeWidth={1.75} aria-hidden="true" />
        {ui.title}
      </p>
      <p className="t-small">{ui.hint}</p>
      <button type="button" className="btn btn-secondary mt-1" onClick={onClear}>
        {ui.clear}
      </button>
    </div>
  );
}

/**
 * Back link to a list. When the list is the previous history entry, it steps back in history so the
 * filters, scroll position and focused card are restored; otherwise it opens the remembered list URL.
 */
export function BackLink({ to, label }: { to: string; label: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <p className="t-meta">
      <Link
        to={to}
        className="plain-link inline-flex min-h-11 items-center gap-1.5 text-fg-2 hover:text-accent"
        onClick={(e) => {
          const from = originOf(location.key);
          if (from && from === to && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
            e.preventDefault();
            navigate(-1);
          }
        }}
      >
        <ArrowLeft size={16} strokeWidth={1.85} aria-hidden="true" />
        {label}
      </Link>
    </p>
  );
}

const KIND_BADGE: Record<NonNullable<DetailSection['kind']>, string> = {
  context: 'badge badge-neutral',
  implemented: 'badge',
  planned: 'badge badge-planned',
  status: 'badge badge-neutral',
};

/** Case-study sections in content order, with implemented / planned badges and source notes. */
export function DetailSections({ sections, lang }: { sections: DetailSection[]; lang?: string }) {
  const { locale, t } = useSite();
  const ui = t.ui.detail;
  return (
    <div lang={lang}>
      {sections.map((s) => (
        <section key={s.id} id={s.id} data-section data-kind={s.kind} aria-labelledby={`${s.id}-title`} className="case-section">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 id={`${s.id}-title`} className="t-h3">
              {s.heading}
            </h2>
            {s.kind && <span className={KIND_BADGE[s.kind]}>{ui.sectionKind[s.kind]}</span>}
          </div>
          <div className="case-body t-body mt-3 space-y-4">
            {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
            {s.list && (
              <ul>
                {s.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {s.pre && <pre className="code-block">{s.pre}</pre>}
          </div>
          {s.source && (
            <p className="t-caption mt-3 text-muted">
              {s.source.url ? (
                <a href={s.source.url} className="plain-link print-url" data-print-url={s.source.url}>
                  {ui.source(s.source.label, formatDate(s.source.retrievedAt, locale))}
                </a>
              ) : (
                ui.source(s.source.label, formatDate(s.source.retrievedAt, locale))
              )}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
