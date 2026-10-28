import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { skillById, skillEvidence } from '@/content/selectors';
import { useSite } from '@/site/context';
import { projectTarget } from '@/site/links';
import { projectsPath } from '@/routing/paths';
import { DUR, EASE, indicatorTransition } from '@/motion';
import { EmptyState } from './ui';

/**
 * Skills grouped by area. Selecting a skill shows the public projects that use it and links to the
 * project directory filtered by that skill. The first skill is selected on the server, so the
 * evidence is readable without JavaScript.
 */
export function SkillExplorer({ idPrefix = 'skills' }: { idPrefix?: string }) {
  const { bundle, locale, t } = useSite();
  const ui = t.ui.skills;
  const first = bundle.skills[0]?.skills[0]?.id;
  const [selected, setSelected] = useState<string | undefined>(first);
  if (bundle.skills.length === 0) return <EmptyState />;

  const skill = selected ? skillById(bundle, selected) : undefined;
  const evidence = selected ? skillEvidence(bundle, selected) : [];

  return (
    <div className="grid-layout items-start">
      <div className="col-span-full space-y-5 lg:col-span-7">
        {bundle.skills.map((g) => (
          <div key={g.id}>
            <h3 id={`${idPrefix}-${g.id}`} className="t-meta font-semibold text-fg-2">
              {t.skillGroups[g.id]}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2" aria-labelledby={`${idPrefix}-${g.id}`}>
              {g.skills.map((s) => {
                const pressed = s.id === selected;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="chip"
                      aria-pressed={pressed}
                      aria-controls={`${idPrefix}-evidence`}
                      onClick={() => setSelected(s.id)}
                      lang="en"
                    >
                      {pressed && <m.span layoutId={`${idPrefix}-indicator`} className="chip-indicator" transition={indicatorTransition} />}
                      <span className="chip-label">
                        {s.name}
                        <span className="chip-count">{s.projectIds.length}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div
        id={`${idPrefix}-evidence`}
        className="card card-surface col-span-full lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:col-span-5"
        aria-live="polite"
      >
        <p className="t-caption font-semibold text-fg-2">{ui.evidence}</p>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={selected ?? 'none'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: DUR.exit } }}
            transition={{ duration: DUR.feedback, ease: EASE }}
          >
            {skill ? (
              <>
                <p className="t-h3 mt-1" lang="en">
                  {skill.name}
                  <span className="t-meta ml-2 font-normal text-muted">{ui.usedIn(evidence.length)}</span>
                </p>
                <ul className="mt-3 space-y-1">
                  {evidence.map((p) => {
                    const target = projectTarget(bundle, locale, p.id)!;
                    return (
                      <li key={p.id} className="t-small">
                        <Link to={target.href} className="prose-link inline-flex min-h-9 items-center" lang="en">
                          {p.name}
                        </Link>
                        <span className="text-muted"> · {t.ui.project.kind[p.kind]}</span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  to={`${projectsPath(locale)}?q=${encodeURIComponent(skill.name)}`}
                  className="text-action mt-2"
                >
                  {ui.filterProjects(skill.name)}
                  <ArrowRight className="arrow" size={16} strokeWidth={1.85} aria-hidden="true" />
                </Link>
              </>
            ) : (
              <p className="t-small mt-1 text-muted">{ui.evidenceHint}</p>
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
