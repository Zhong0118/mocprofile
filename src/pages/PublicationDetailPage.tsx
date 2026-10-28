import { useParams } from 'react-router-dom';
import { findPublicationDetail } from '@/content/selectors';
import { useSite } from '@/site/context';
import { publicationsPath } from '@/routing/paths';
import { AuthorList, publicationFacts, publicationResources } from '@/components/PublicationEntry';
import { ResourceRow } from '@/components/ResourceRow';
import { MetaLine } from '@/components/MetaLine';
import { BibtexBlock } from '@/components/BibtexBlock';
import { BackLink, DetailSections } from './PageParts';
import NotFoundPage from './NotFoundPage';

export default function PublicationDetailPage() {
  const { id = '' } = useParams();
  const { bundle } = useSite();
  const pub = findPublicationDetail(bundle, id);
  if (!pub) return <NotFoundPage />;
  return <PublicationDetail id={pub.id} />;
}

function PublicationDetail({ id }: { id: string }) {
  const { bundle, locale, t } = useSite();
  const pub = findPublicationDetail(bundle, id)!;
  const text = t.publications[id];
  const ui = t.ui;
  const toLang = (l: 'zh' | 'en') => (l === 'zh' ? 'zh-CN' : 'en');
  const abstractInOtherLanguage = pub.abstract && pub.abstract.lang !== locale;

  return (
    <article className="page-wrap">
      <div className="page-top measure">
        <BackLink to={publicationsPath(locale)} label={ui.detail.backToPublications} />
        <h1 className="t-h1 mt-3" lang={toLang(pub.titleLang)}>
          {pub.originalTitle}
        </h1>
        {text.translatedTitle && <p className="t-meta mt-1 text-muted">{text.translatedTitle}</p>}
        <div className="mt-3">
          <AuthorList authors={pub.authors} />
          <MetaLine
            items={[ui.publication.type[pub.type], ...publicationFacts(pub, ui.publication.status[pub.publicationStatus])]}
          />
        </div>
        <ResourceRow className="mt-2" items={publicationResources(pub, ui.resources)} />

        {pub.abstract && (
          <section className="mt-9">
            <h2 className="t-h2">{ui.publication.abstract}</h2>
            {abstractInOtherLanguage && (
              <p className="t-caption mt-1 text-muted">
                {ui.publication.originalLanguage(ui.languageName[pub.abstract.lang])}
              </p>
            )}
            <p className="t-body break-url mt-3" lang={toLang(pub.abstract.lang)}>
              {pub.abstract.text}
            </p>
          </section>
        )}

        {pub.figure && (
          <figure className="mt-9">
            <img
              src={pub.figure.src}
              width={pub.figure.width}
              height={pub.figure.height}
              alt={text.figureAlt ?? ''}
              loading="lazy"
              className="figure-img h-auto w-full"
            />
            {text.figureCaption && <figcaption className="t-caption mt-2 text-muted">{text.figureCaption}</figcaption>}
          </figure>
        )}

        {text.sections && <DetailSections sections={text.sections} />}

        {pub.bibtex && (
          <div className="mt-9">
            <BibtexBlock bibtex={pub.bibtex} />
          </div>
        )}
      </div>
    </article>
  );
}
