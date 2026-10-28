import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSite } from '@/site/context';

export interface ResourceItem {
  label: string;
  href: string;
  /** Internal route rendered with the router. */
  internal?: boolean;
}

/** A row of text links. Only real resources are passed in; empty rows render nothing. */
export function ResourceRow({ items, className }: { items: ResourceItem[]; className?: string }) {
  const { bundle } = useSite();
  if (items.length === 0) return null;
  return (
    <ul className={cn('resource-row t-meta', className)}>
      {items.map((item) => (
        <li key={item.href + item.label}>
          {item.internal ? (
            <Link to={item.href} className="plain-link print-url" data-print-url={bundle.site.url + item.href}>
              {item.label}
            </Link>
          ) : (
            <a href={item.href} className="plain-link print-url" data-print-url={item.href.replace(/^mailto:/, '')}>
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Builds items from optional hrefs, preserving the given order and skipping missing ones. */
export function resources(pairs: [label: string, href: string | undefined, internal?: boolean][]): ResourceItem[] {
  return pairs
    .filter((p): p is [string, string, boolean | undefined] => Boolean(p[1]))
    .map(([label, href, internal]) => ({ label, href, internal }));
}
