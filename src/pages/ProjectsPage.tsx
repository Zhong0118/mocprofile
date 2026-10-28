import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, m } from 'motion/react';
import { LayoutGrid, List } from 'lucide-react';
import {
  DEFAULT_PROJECT_QUERY,
  filterProjects,
  parseProjectQuery,
  projectFilterCounts,
  serializeQuery,
  type ProjectQuery,
} from '@/content/selectors';
import { PROJECT_FILTERS } from '@/content/types';
import { cn } from '@/lib/utils';
import { useSite } from '@/site/context';
import { useHydrated } from '@/site/hydration';
import { rememberListUrl } from '@/site/nav-memory';
import { DUR, EASE, layoutTransition, stagger } from '@/motion';
import { ProjectCard } from '@/components/ProjectCard';
import { ChipGroup, ResultCount, SearchField, Segmented } from '@/components/ui';
import { NoMatch, PageHeader } from './PageParts';

const EMPTY = new URLSearchParams();

/** URL-backed query state: the query string is the single source of truth. */
export function useUrlQuery<T extends object>(parse: (params: URLSearchParams) => T, defaults: T) {
  const hydrated = useHydrated();
  const location = useLocation();
  const navigate = useNavigate();
  // During hydration the prerendered default state must be reproduced exactly.
  const query = parse(hydrated ? new URLSearchParams(location.search) : EMPTY);
  const update = (patch: Partial<T>) => {
    // Read the live URL, not this render's query: router updates commit as transitions, so a quick
    // second change (a key press right after a chip change) could otherwise start from stale state.
    const next = { ...parse(new URLSearchParams(window.location.search)), ...patch };
    navigate({ pathname: location.pathname, search: serializeQuery(next as Record<string, string>, defaults as Record<string, string>), hash: '' }, { replace: true });
  };
  return { query, update, hydrated };
}

export default function ProjectsPage() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui;
  const { pathname, search } = useLocation();
  const { query, update } = useUrlQuery<ProjectQuery>(parseProjectQuery, DEFAULT_PROJECT_QUERY);
  const results = filterProjects(bundle, locale, query);
  const counts = projectFilterCounts(bundle);
  const total = bundle.projects.length;
  const filtered = query.type !== 'all' || query.q.trim() !== '';

  useEffect(() => rememberListUrl('projects', pathname + search), [pathname, search]);

  return (
    <div className="page-wrap">
      <PageHeader title={ui.modules.projects} lead={ui.moduleLead.projects} />

      <div className="js-only mt-6 flex flex-col gap-3" role="search" aria-label={ui.filters.label}>
        <ChipGroup
          label={ui.filters.type}
          layoutId="project-filter"
          value={query.type}
          onChange={(type) => update({ type })}
          options={PROJECT_FILTERS.map((f) => ({ value: f, label: ui.project.filter[f], count: counts[f] }))}
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1 basis-64">
            <SearchField
              id="project-search"
              label={ui.filters.search}
              placeholder={ui.filters.searchPlaceholder}
              value={query.q}
              onChange={(q) => update({ q })}
              clearLabel={ui.filters.clear}
            />
          </div>
          <Segmented
            label={ui.filters.view}
            layoutId="project-view"
            value={query.view}
            onChange={(view) => update({ view })}
            options={[
              { value: 'grid', label: ui.filters.grid, icon: <LayoutGrid size={18} strokeWidth={1.85} aria-hidden="true" /> },
              { value: 'list', label: ui.filters.list, icon: <List size={18} strokeWidth={1.85} aria-hidden="true" /> },
            ]}
          />
        </div>
        <div className="flex min-h-9 flex-wrap items-center gap-x-4">
          <ResultCount text={ui.filters.results(results.length, total)} />
          {filtered && results.length > 0 && (
            <button type="button" className="plain-link t-meta min-h-9 text-accent" onClick={() => update({ type: 'all', q: '' })}>
              {ui.filters.clear}
            </button>
          )}
        </div>
      </div>

      <div className="mb-16 mt-5">
        {results.length === 0 ? (
          <NoMatch onClear={() => update({ type: 'all', q: '' })} />
        ) : (
          <ul className={cn('grid-layout', query.view === 'list' && 'gap-y-3')}>
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((p, i) => (
                <m.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: DUR.feedback, ease: EASE, delay: stagger(i) } }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: DUR.exit, ease: EASE } }}
                  transition={layoutTransition}
                  className={query.view === 'list' ? 'col-span-full' : 'col-span-full md:col-span-4 lg:col-span-4'}
                >
                  <ProjectCard project={p} variant={query.view} headingLevel={2} />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
