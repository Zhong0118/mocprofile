import { cn } from '@/lib/utils';

/** Facts separated by a middle dot. The dot is real text (copyable) but hidden from screen readers. */
export function MetaLine({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <p className={cn('t-meta text-muted', className)}>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && (
            <span aria-hidden="true" className="px-1.5">
              ·
            </span>
          )}
          {item}
        </span>
      ))}
    </p>
  );
}
