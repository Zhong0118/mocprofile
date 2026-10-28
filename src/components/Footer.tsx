import { formatDate } from '@/content/selectors';
import { useSite } from '@/site/context';
import { MetaLine } from './MetaLine';
import { ResourceRow, resources } from './ResourceRow';

export function Footer() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui;
  const { person, site } = bundle;
  const endYear = Number(site.updatedAt.slice(0, 4));
  const years = endYear > site.copyrightStartYear ? `${site.copyrightStartYear}–${endYear}` : String(site.copyrightStartYear);

  return (
    <footer className="site-footer border-t border-border bg-surface">
      <div className="page-wrap flex flex-col gap-2 py-8 sm:flex-row sm:items-center sm:justify-between">
        <MetaLine
          className="t-caption"
          items={[ui.footer.copyright(years, person.displayName), ui.footer.updatedAt(formatDate(site.updatedAt, locale))]}
        />
        <ResourceRow
          items={resources([
            [ui.resources.github, person.links.github],
            [ui.resources.blog, person.links.blog],
          ])}
        />
      </div>
    </footer>
  );
}
