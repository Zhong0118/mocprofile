import type { Experience } from '@/content/types';
import { formatDate } from '@/content/selectors';
import { useSite } from '@/site/context';

/** Time on the left (128px column on wide screens), role and organisation on the right. */
export function ExperienceEntry({ item }: { item: Experience }) {
  const { locale, t } = useSite();
  const text = t.experience[item.id];
  const end =
    item.end === 'present' ? (
      t.ui.experience.present
    ) : item.end ? (
      <time dateTime={item.end}>{formatDate(item.end, locale)}</time>
    ) : null;

  return (
    <article className="cv-entry grid gap-1 sm:grid-cols-[128px_1fr] sm:gap-6">
      <p className="t-meta tabular text-muted sm:pt-0.5">
        <time dateTime={item.start}>{formatDate(item.start, locale)}</time>
        {end && <> – {end}</>}
      </p>
      <div className="min-w-0">
        <h3 className="t-entry">{text.role}</h3>
        <p className="t-meta text-muted">{text.organization}</p>
        {text.description && <p className="t-body measure mt-1.5">{text.description}</p>}
      </div>
    </article>
  );
}
