import { Link } from 'react-router-dom';
import { useSite } from '@/site/context';
import { homePath } from '@/routing/paths';

/** Client-side fallback only. The hosting layer serves dist/404.html with a real HTTP 404. */
export default function NotFoundPage() {
  const { locale, t } = useSite();
  return (
    <div className="shell">
      <div className="page-top detail-measure">
        <h1 className="t-detail-h1">{t.ui.notFound.title}</h1>
        <p className="t-body mt-3">{t.ui.notFound.description}</p>
        <p className="t-body mt-4">
          <Link to={homePath(locale)} className="prose-link">
            {t.ui.notFound.home}
          </Link>
        </p>
      </div>
    </div>
  );
}
