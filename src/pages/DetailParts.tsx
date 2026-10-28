import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { DetailSection } from '@/content/types';

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <p className="t-meta">
      <Link to={to} className="plain-link inline-flex items-center gap-1.5 py-1.5">
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        {label}
      </Link>
    </p>
  );
}

/** Renders only the sections that exist in the content; no template headings. */
export function DetailSections({ sections, lang }: { sections: DetailSection[]; lang?: string }) {
  return (
    <div lang={lang}>
      {sections.map((s) => (
        <section key={s.heading} className="mt-9">
          <h2 className="t-h2">{s.heading}</h2>
          <div className="t-detail-body mt-3 space-y-4">
            {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
            {s.list && (
              <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
                {s.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {s.pre && <pre className="code-block">{s.pre}</pre>}
          </div>
        </section>
      ))}
    </div>
  );
}
