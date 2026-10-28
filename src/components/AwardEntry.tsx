import type { Award } from '@/content/types';
import { formatDate } from '@/content/selectors';
import { useSite } from '@/site/context';
import { MetaLine } from './MetaLine';

export function AwardEntry({ award }: { award: Award }) {
  const { locale, t } = useSite();
  const ui = t.ui.awards;
  const text = t.awards[award.id];
  return (
    <article className="cv-entry timeline-item">
      <p className="t-meta tabular text-muted">
        <time dateTime={award.date}>{formatDate(award.date, locale)}</time>
      </p>
      <div className="min-w-0">
        <h3 className="t-h4">{text.title}</h3>
        <MetaLine
          items={[text.issuer, award.level && ui.level[award.level], ui.participation[award.participation], text.role].filter(
            (x): x is string => Boolean(x),
          )}
        />
        {text.description && <p className="t-small measure mt-1.5">{text.description}</p>}
        {award.evidence && (
          <p className="t-meta mt-1">
            <a href={award.evidence} className="plain-link print-url" data-print-url={award.evidence}>
              {ui.evidence}
            </a>
          </p>
        )}
      </div>
    </article>
  );
}
