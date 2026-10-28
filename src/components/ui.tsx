// Small shared building blocks: module sections, empty states, tags and filter controls.
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'motion/react';
import { ArrowRight, Check, Copy, Inbox, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSite } from '@/site/context';
import { indicatorTransition } from '@/motion';

export function ModuleSection({
  id,
  title,
  lead,
  action,
  headingLevel = 2,
  className,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  action?: { label: string; to: string };
  headingLevel?: 2 | 3;
  className?: string;
  children: ReactNode;
}) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <section id={id} data-section aria-labelledby={`${id}-title`} className={cn('module', className)}>
      <div className="module-head">
        <div className="min-w-0 max-w-[46rem]">
          <H id={`${id}-title`} className={headingLevel === 2 ? 't-h2' : 't-h3'}>
            {title}
          </H>
          {lead && <p className="t-small mt-2 text-fg-2">{lead}</p>}
        </div>
        {action && <ActionLink to={action.to}>{action.label}</ActionLink>}
      </div>
      {children}
    </section>
  );
}

export function ActionLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cn('text-action', className)}>
      {children}
      <ArrowRight className="arrow" size={16} strokeWidth={1.85} aria-hidden="true" />
    </Link>
  );
}

/** Compact state for a module without public entries. The module itself never disappears. */
export function EmptyState({ className, children }: { className?: string; children?: ReactNode }) {
  const { t } = useSite();
  return (
    <p className={cn('empty-state', className)}>
      <Inbox size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
      <span>{children ?? t.ui.emptyState}</span>
    </p>
  );
}

/** At most `max` tags, then "+n". The hidden ones stay readable to screen readers via the title. */
export function TagList({ items, max = 3, className }: { items: string[]; max?: number; className?: string }) {
  const { t } = useSite();
  if (items.length === 0) return null;
  const shown = items.slice(0, max);
  const rest = items.slice(max);
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {shown.map((tag) => (
        <li key={tag} className="tag">
          {tag}
        </li>
      ))}
      {rest.length > 0 && (
        <li className="tag" title={rest.join(', ')}>
          <span aria-hidden="true">{t.ui.project.moreTags(rest.length)}</span>
          <span className="sr-only">{rest.join(', ')}</span>
        </li>
      )}
    </ul>
  );
}

/** Moves focus between sibling radios with arrow keys, Home and End (roving tabindex). */
function onRovingKey(e: KeyboardEvent<HTMLElement>, select: (index: number) => void, count: number, index: number) {
  const keys: Record<string, number> = {
    ArrowRight: index + 1,
    ArrowDown: index + 1,
    ArrowLeft: index - 1,
    ArrowUp: index - 1,
    Home: 0,
    End: count - 1,
  };
  if (!(e.key in keys)) return;
  e.preventDefault();
  const next = (keys[e.key] + count) % count;
  select(next);
  const group = e.currentTarget.parentElement;
  (group?.children[next] as HTMLElement | undefined)?.focus();
}

export interface ChipOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

/** Single-choice chip row (radiogroup). The selected background slides between chips. */
export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  layoutId,
}: {
  label: string;
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId: string;
}) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o, i) => {
        const checked = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={i === index ? 0 : -1}
            className="chip"
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onRovingKey(e, (n) => onChange(options[n].value), options.length, i)}
          >
            {checked && <m.span layoutId={layoutId} className="chip-indicator" transition={indicatorTransition} />}
            <span className="chip-label">
              {o.label}
              {o.count !== undefined && <span className="chip-count">{o.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  clearLabel,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  clearLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // The URL commits as a low-priority router update, so the field keeps its own text while it is being
  // edited and only follows the URL when the change came from elsewhere (clear filters, back / forward).
  const [text, setText] = useState(value);
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setText(value);
  }, [value]);
  const set = (next: string) => {
    setText(next);
    onChange(next);
  };
  return (
    <div className="field w-full">
      <Search size={18} strokeWidth={1.85} aria-hidden="true" className="shrink-0" />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={text}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        maxLength={80}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && text) {
            e.preventDefault();
            set('');
          }
        }}
      />
      {text && (
        <button
          type="button"
          className="icon-button"
          aria-label={clearLabel}
          onClick={() => {
            set('');
            inputRef.current?.focus();
          }}
        >
          <X size={16} strokeWidth={1.85} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/** Two or more toggle buttons sharing one sliding indicator. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  layoutId,
}: {
  label: string;
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  layoutId: string;
}) {
  return (
    <div role="group" aria-label={label} className="segmented">
      {options.map((o) => {
        const pressed = o.value === value;
        return (
          <button key={o.value} type="button" aria-pressed={pressed} onClick={() => onChange(o.value)} title={o.label}>
            {pressed && <m.span layoutId={layoutId} className="chip-indicator" transition={indicatorTransition} />}
            <span className="seg-label">
              {o.icon}
              <span className={o.icon ? 'sr-only sm:not-sr-only' : undefined}>{o.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Polite live region announcing the number of results after a filter change. */
export function ResultCount({ text }: { text: string }) {
  return (
    <p className="t-meta text-muted" role="status" aria-live="polite" aria-atomic="true">
      {text}
    </p>
  );
}

type CopyState = 'idle' | 'copied' | 'failed';

/** Copies a value and reports the real outcome; failure leaves the value selectable. */
export function CopyButton({
  value,
  label,
  copiedLabel,
  failedLabel,
  className,
}: {
  value: string;
  label: string;
  copiedLabel: string;
  failedLabel: string;
  className?: string;
}) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
    timer.current = window.setTimeout(() => setState('idle'), 2000);
  };

  return (
    <span className={cn('card-action js-only inline-flex items-center gap-2', className)}>
      <button type="button" className="icon-button" aria-label={label} title={label} onClick={copy}>
        {state === 'copied' ? (
          <Check size={18} strokeWidth={1.85} aria-hidden="true" className="text-accent" />
        ) : (
          <Copy size={18} strokeWidth={1.85} aria-hidden="true" />
        )}
      </button>
      <span role="status" aria-live="polite" className={cn('t-caption', state === 'failed' ? 'text-danger' : 'text-accent')}>
        {state === 'copied' ? copiedLabel : state === 'failed' ? failedLabel : ''}
      </span>
    </span>
  );
}
