import { filterPublications, parsePublicationQuery, publicationFacets, type PublicationQuery } from '@/content/selectors';
import { useSite } from '@/site/context';
import { PublicationEntry } from '@/components/PublicationEntry';
import { ChipGroup, EmptyState, ResultCount } from '@/components/ui';
import { NoMatch, PageHeader } from './PageParts';
import { useUrlQuery } from './ProjectsPage';

/** Publication index. Filters appear only when there is something to filter. */
export default function PublicationsPage() {
  const { bundle, t } = useSite();
  const ui = t.ui;
  const facets = publicationFacets(bundle);
  const { query, update } = useUrlQuery<PublicationQuery>((p) => parsePublicationQuery(bundle, p), {
    year: '',
    type: '',
    status: '',
  });
  const results = filterPublications(bundle, query);
  const total = bundle.publications.length;
  const all = { value: '', label: ui.filters.all } as const;

  return (
    <div className="page-wrap">
      <PageHeader title={ui.modules.publications} />
      <div className="mb-16 mt-6">
        {total === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="js-only mb-6 flex flex-col gap-3" role="search" aria-label={ui.filters.label}>
              {facets.years.length > 1 && (
                <ChipGroup
                  label={ui.filters.year}
                  layoutId="pub-year"
                  value={query.year}
                  onChange={(year) => update({ year })}
                  options={[all, ...facets.years.map((y) => ({ value: y, label: y }))]}
                />
              )}
              {facets.types.length > 1 && (
                <ChipGroup
                  label={ui.filters.type}
                  layoutId="pub-type"
                  value={query.type}
                  onChange={(type) => update({ type })}
                  options={[all, ...facets.types.map((v) => ({ value: v, label: ui.publication.type[v] }))]}
                />
              )}
              {facets.statuses.length > 1 && (
                <ChipGroup
                  label={ui.filters.status}
                  layoutId="pub-status"
                  value={query.status}
                  onChange={(status) => update({ status })}
                  options={[all, ...facets.statuses.map((v) => ({ value: v, label: ui.publication.status[v] }))]}
                />
              )}
              <ResultCount text={ui.filters.results(results.length, total)} />
            </div>
            {results.length === 0 ? (
              <NoMatch onClear={() => update({ year: '', type: '', status: '' })} />
            ) : (
              <ol className="space-y-8">
                {results.map((p) => (
                  <li key={p.id}>
                    <PublicationEntry pub={p} />
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </div>
  );
}
