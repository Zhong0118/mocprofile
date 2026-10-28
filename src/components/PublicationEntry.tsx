import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Author, Publication } from '@/content/types';
import { useSite } from '@/site/context';
import { entryAnchor, publicationTarget } from '@/site/links';
import { publicationPath } from '@/routing/paths';
import { BibtexBlock } from './BibtexBlock';
import { MetaLine } from './MetaLine';
import { ResourceRow, resources } from './ResourceRow';

export function AuthorList({ authors }: { authors: Author[] }) {
  const { bundle, t } = useSite();
  const hasEqual = authors.some((a) => a.equalContribution);
  return (
    <p className="t-meta">
      {authors.map((a, i) => (
        <span key={i}>
          {i > 0 && ', '}
          <span className={a.personId === bundle.person.id ? 'font-semibold text-fg' : undefined}>{a.name}</span>
          {a.equalContribution && <sup aria-hidden="true">*</sup>}
        </span>
      ))}
      {hasEqual && <span className="text-muted"> ({t.ui.publication.equalContribution})</span>}
    </p>
  );
}

export function publicationFacts(pub: Publication, statusLabel: string): string[] {
  return [pub.venue, String(pub.year), statusLabel].filter((x): x is string => Boolean(x));
}

export function publicationResources(pub: Publication, labels: { [k: string]: string }, detailHref?: string) {
  return resources([
    [labels.detail, detailHref, true],
    [labels.pdf, pub.resources.pdf],
    [labels.paper, pub.resources.paper],
    [labels.arxiv, pub.arxiv ? `https://arxiv.org/abs/${pub.arxiv}` : undefined],
    [labels.doi, pub.doi ? `https://doi.org/${pub.doi}` : undefined],
    [labels.code, pub.resources.code],
    [labels.project, pub.resources.project],
  ]);
}

/** Bibliography entry: title → authors → venue/year/status → one sentence → resources. */
export function PublicationEntry({ pub, showFigure = true }: { pub: Publication; showFigure?: boolean }) {
  const { bundle, locale, t } = useSite();
  const text = t.publications[pub.id];
  const ui = t.ui;
  const target = publicationTarget(bundle, locale, pub.id);
  const lang = pub.titleLang === 'zh' ? 'zh-CN' : 'en';
  const titleNode = target ? (
    target.internal ? (
      <Link to={target.href} className="plain-link">{pub.originalTitle}</Link>
    ) : (
      <a href={target.href} className="plain-link">{pub.originalTitle}</a>
    )
  ) : (
    pub.originalTitle
  );
  const abstractLang = pub.abstract?.lang === 'zh' ? 'zh-CN' : 'en';

  return (
    <article id={entryAnchor('publication', pub.id)} className="cv-entry flex gap-6">
      <div className="min-w-0 flex-1">
        <h3 className="t-h3" lang={lang}>
          {titleNode}
        </h3>
        {text?.translatedTitle && <p className="t-meta text-muted">{text.translatedTitle}</p>}
        <div className="mt-1.5">
          <AuthorList authors={pub.authors} />
          <MetaLine items={publicationFacts(pub, ui.publication.status[pub.publicationStatus])} />
        </div>
        {text?.summary && <p className="t-body measure mt-2">{text.summary}</p>}
        <ResourceRow
          className="mt-1.5"
          items={publicationResources(pub, ui.resources, pub.detail ? publicationPath(locale, pub.id) : undefined).filter(
            (r) => r.href !== target?.href,
          )}
        />
        {pub.abstract && (
          <details className="disclosure t-meta">
            <summary>
              <ChevronRight className="chevron" size={16} strokeWidth={1.75} aria-hidden="true" />
              <span className="when-closed">{ui.publication.showAbstract}</span>
              <span className="when-open">{ui.publication.hideAbstract}</span>
            </summary>
            <p className="t-body measure break-url mt-1 text-fg" lang={abstractLang}>
              {pub.abstract.text}
            </p>
          </details>
        )}
        {pub.bibtex && <BibtexBlock bibtex={pub.bibtex} />}
      </div>
      {showFigure && pub.figure && (
        <img
          src={pub.figure.src}
          width={152}
          height={114}
          alt={text?.figureAlt ?? ''}
          loading="lazy"
          decoding="async"
          className="figure-img hidden h-[114px] w-[152px] shrink-0 sm:block"
        />
      )}
    </article>
  );
}
