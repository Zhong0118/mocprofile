import { Link } from 'react-router-dom';
import { useSite } from '@/site/context';
import { projectTarget } from '@/site/links';

/** The research directions as three cards: question, approach and the public work behind them. */
export function DirectionCards({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const { bundle, locale, t } = useSite();
  const H = headingLevel === 3 ? 'h3' : 'h4';
  return (
    <ul className="grid-layout">
      {bundle.directions.map((d, i) => {
        const text = t.directions[d.id];
        return (
          <li key={d.id} id={`direction-${d.id}`} className="card col-span-full md:col-span-4 lg:col-span-4">
            <p className="t-caption tabular font-semibold text-muted">0{i + 1}</p>
            <H className="t-h3 mt-1">{text.label}</H>
            <p className="t-small mt-3">{text.question}</p>
            <p className="t-small mt-2 text-fg-2">{text.approach}</p>
            <div className="mt-auto pt-4">
              <p className="t-caption text-muted">{t.ui.hero.relatedWork}</p>
              <ul className="mt-1 flex flex-wrap gap-x-4">
                {d.projectIds.map((pid) => {
                  const target = projectTarget(bundle, locale, pid);
                  const name = bundle.projects.find((p) => p.id === pid)?.name;
                  return (
                    target && (
                      <li key={pid}>
                        <Link to={target.href} className="prose-link t-meta inline-flex min-h-9 items-center" lang="en">
                          {name}
                        </Link>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
