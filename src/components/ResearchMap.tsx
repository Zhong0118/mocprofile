import { useId, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useSite } from '@/site/context';
import { projectTarget } from '@/site/links';
import { homePath } from '@/routing/paths';
import { DUR, EASE, indicatorTransition } from '@/motion';

// Line end points in the 100×100 viewBox, matching .map-node[data-pos] in index.css.
const NODE_POINTS = [
  [22, 16],
  [78, 16],
  [50, 86],
] as const;
const CENTER = [50, 48] as const;

/**
 * Research directions as a small diagram: a centre node and one node per direction. The nodes are
 * a real tablist (arrow keys, Home/End, touch); the panel shows the selected direction's question
 * and its projects. Below 768px the same tabs collapse into a compact row.
 */
export function ResearchMap() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui.hero;
  const directions = bundle.directions.slice(0, 3);
  const [selected, setSelected] = useState(0);
  const base = useId();
  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = `${base}-panel`;
  if (directions.length === 0) return null;

  const current = directions[selected];
  const text = t.directions[current.id];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = directions.length;
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const index = (next + n) % n;
    setSelected(index);
    document.getElementById(tabId(index))?.focus();
  };

  return (
    <div className="map-card">
      <p className="t-caption mb-3 font-semibold text-fg-2">{ui.mapLabel}</p>
      <div className="map">
        <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {directions.map((d, i) => (
            <line
              key={d.id}
              x1={CENTER[0]}
              y1={CENTER[1]}
              x2={NODE_POINTS[i][0]}
              y2={NODE_POINTS[i][1]}
              vectorEffect="non-scaling-stroke"
              data-active={i === selected}
            />
          ))}
        </svg>
        <span className="map-center" aria-hidden="true">
          {ui.mapCenter}
        </span>
        <div role="tablist" aria-label={ui.directionsLabel} className="contents">
          {directions.map((d, i) => {
            const active = i === selected;
            return (
              <button
                key={d.id}
                id={tabId(i)}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={panelId}
                tabIndex={active ? 0 : -1}
                data-pos={i}
                className="map-node"
                onClick={() => setSelected(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {active && <m.span layoutId="map-indicator" className="node-indicator" transition={indicatorTransition} />}
                <span className="node-label">{t.directions[d.id].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={tabId(selected)} className="map-panel" tabIndex={0}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2, transition: { duration: DUR.exit, ease: EASE } }}
            transition={{ duration: DUR.feedback, ease: EASE }}
          >
            <p className="t-small">{text.question}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="t-caption text-muted">{ui.relatedWork}</span>
              {current.projectIds.map((pid) => {
                const target = projectTarget(bundle, locale, pid);
                const name = bundle.projects.find((p) => p.id === pid)?.name;
                return (
                  target && (
                    <Link key={pid} to={target.href} className="prose-link t-meta inline-flex min-h-9 items-center" lang="en">
                      {name}
                    </Link>
                  )
                );
              })}
              <Link to={`${homePath(locale)}#research`} className="t-meta ml-auto inline-flex min-h-9 items-center gap-1 text-fg-2 hover:text-accent">
                {ui.viewAllInDirection}
                <ArrowRight size={14} strokeWidth={1.85} aria-hidden="true" />
              </Link>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
