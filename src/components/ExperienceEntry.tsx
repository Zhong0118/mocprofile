import type { Experience } from '@/content/types';
import { formatDate } from '@/content/selectors';
import { useSite } from '@/site/context';
import { MetaLine } from './MetaLine';

/** Time on the left, role, organisation and highlights on the right. Dates keep their known precision. */
export function ExperienceEntry({ item }: { item: Experience }) {
  const { locale, t } = useSite();
  const text = t.experience[item.id];
  const end =
    item.end === 'present' ? t.ui.experience.present : item.end ? <time dateTime={item.end}>{formatDate(item.end, locale)}</time> : null;

  return (
    <article className="cv-entry timeline-item">
      <p className="t-meta tabular text-muted">
        <time dateTime={item.start}>{formatDate(item.start, locale)}</time>
        {end && <> – {end}</>}
      </p>
      <div className="min-w-0">
        <h3 className="t-h4">{text.role}</h3>
        <MetaLine items={[text.organization, text.degree, text.field, t.ui.experience.kind[item.kind]].filter((x): x is string => Boolean(x))} />
        {text.description && <p className="t-small measure mt-1.5">{text.description}</p>}
        {text.highlights && (
          <ul className="t-small mt-1.5 list-disc space-y-1 pl-5 marker:text-muted">
            {text.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
