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
    <footer id="contact" className="site-footer section-gap border-t border-sep">
      <div className="shell py-8">
        <h2 className="t-h2">{ui.sections.contact}</h2>
        {person.email && (
          <p className="t-body mt-3">
            <a href={`mailto:${person.email}`} className="prose-link break-url">{person.email}</a>
          </p>
        )}
        <ResourceRow
          className="mt-1"
          items={resources([
            [ui.resources.github, person.links.github],
            [ui.resources.blog, person.links.blog],
            [ui.resources.scholar, person.links.scholar],
            [ui.resources.orcid, person.links.orcid],
          ])}
        />
        <MetaLine
          className="t-caption mt-4"
          items={[ui.footer.copyright(years, person.displayName), ui.footer.updatedAt(formatDate(site.updatedAt, locale))]}
        />
      </div>
    </footer>
  );
}
