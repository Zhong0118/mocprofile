import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'motion/react';
import { filterRepositories, formatDate, parseRepositoryQuery, repositoryLanguages } from '@/content/selectors';
import { useSite } from '@/site/context';
import { rememberListUrl } from '@/site/nav-memory';
import { DUR, EASE, layoutTransition, stagger } from '@/motion';
import { RepositoryCard } from '@/components/RepositoryCard';
import { ChipGroup, EmptyState, ResultCount, SearchField } from '@/components/ui';
import { NoMatch, PageHeader } from './PageParts';
import { useUrlQuery } from './ProjectsPage';

export default function RepositoriesPage() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui;
  const { pathname, search } = useLocation();
  const languages = repositoryLanguages(bundle);
  const { query, update } = useUrlQuery((p) => parseRepositoryQuery(bundle, p), { q: '', lang: '' });
  const results = filterRepositories(bundle, locale, query);
  const total = bundle.repositories.length;
  const sources = [...new Set(bundle.repositories.map((r) => r.source.retrievedAt))].sort().reverse();

  useEffect(() => rememberListUrl('repositories', pathname + search), [pathname, search]);

  return (
    <div className="page-wrap">
      <PageHeader title={ui.modules.repositories} lead={ui.moduleLead.repositories} />

      {total === 0 ? (
        <EmptyState className="mb-16 mt-6" />
      ) : (
        <>
          <div className="js-only mt-6 flex flex-col gap-3" role="search" aria-label={ui.filters.label}>
            <div className="max-w-xl">
              <SearchField
                id="repo-search"
                label={ui.filters.search}
                placeholder={ui.filters.searchPlaceholder}
                value={query.q}
                onChange={(q) => update({ q })}
                clearLabel={ui.filters.clear}
              />
            </div>
            <ChipGroup
              label={ui.filters.language}
              layoutId="repo-language"
              value={query.lang}
              onChange={(lang) => update({ lang })}
              options={[
                { value: '', label: ui.filters.allLanguages, count: total },
                ...languages.map((l) => ({
                  value: l,
                  label: l,
                  count: bundle.repositories.filter((r) => r.languages.includes(l)).length,
                })),
              ]}
            />
            <ResultCount text={ui.filters.results(results.length, total)} />
          </div>

          <div className="mt-5">
            {results.length === 0 ? (
              <NoMatch onClear={() => update({ q: '', lang: '' })} />
            ) : (
              <ul className="grid-layout">
                <AnimatePresence mode="popLayout" initial={false}>
                  {results.map((r, i) => (
                    <m.li
                      key={r.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1, transition: { duration: DUR.feedback, ease: EASE, delay: stagger(i) } }}
                      exit={{ opacity: 0, scale: 0.98, transition: { duration: DUR.exit, ease: EASE } }}
                      transition={layoutTransition}
                      className="col-span-full md:col-span-4 lg:col-span-4"
                    >
                      <RepositoryCard repo={r} />
                    </m.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
          {sources[0] && <p className="t-caption mb-16 mt-6 text-muted">{ui.repository.source(formatDate(sources[0], locale))}</p>}
        </>
      )}
    </div>
  );
}
