import { Fragment, StrictMode, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import type { ContentBundle } from '@/content/types';
import { hasCv } from '@/content/selectors';
import { localeFromPath } from '@/routing/paths';
import { SiteContext } from '@/site/context';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import CvPage from '@/pages/CvPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import PublicationDetailPage from '@/pages/PublicationDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';

/** Shared by the client (BrowserRouter + hydrateRoot) and the build-time renderer (StaticRouter). */
export function App({ bundle }: { bundle: ContentBundle }) {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const site = useMemo(() => ({ bundle, locale, t: bundle.locales[locale] }), [bundle, locale]);
  const cv = hasCv(bundle);

  return (
    <StrictMode>
      <SiteContext.Provider value={site}>
        <Layout>
          <Routes>
            {['', '/en'].map((prefix) => (
              <Fragment key={prefix || 'zh'}>
                <Route path={`${prefix}/`} element={<HomePage />} />
                {cv && <Route path={`${prefix}/cv`} element={<CvPage />} />}
                <Route path={`${prefix}/projects/:id`} element={<ProjectDetailPage />} />
                <Route path={`${prefix}/papers/:id`} element={<PublicationDetailPage />} />
              </Fragment>
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </SiteContext.Provider>
    </StrictMode>
  );
}
