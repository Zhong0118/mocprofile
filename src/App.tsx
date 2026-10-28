import { Fragment, lazy, StrictMode, Suspense, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import type { ContentBundle } from '@/content/types';
import { isModuleEnabled } from '@/content/selectors';
import { CONTENT_REVIEW_PATH, localeFromPath } from '@/routing/paths';
import { SiteContext } from '@/site/context';
import { MotionProvider } from '@/motion';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ProjectsPage from '@/pages/ProjectsPage';
import PublicationsPage from '@/pages/PublicationsPage';
import RepositoriesPage from '@/pages/RepositoriesPage';
import CvPage from '@/pages/CvPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import PublicationDetailPage from '@/pages/PublicationDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Dev-only content review. `import.meta.env.DEV` is statically false in builds, so this import
// and its chunk are removed from production output.
const ContentReviewPage = import.meta.env.DEV ? lazy(() => import('@/pages/ContentReviewPage')) : null;

/** Shared by the client (BrowserRouter + hydrateRoot) and the build-time renderer (StaticRouter). */
export function App({ bundle }: { bundle: ContentBundle }) {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const site = useMemo(() => ({ bundle, locale, t: bundle.locales[locale] }), [bundle, locale]);
  const on = (id: Parameters<typeof isModuleEnabled>[1]) => isModuleEnabled(bundle, id);

  return (
    <StrictMode>
      <SiteContext.Provider value={site}>
        <MotionProvider>
          <Layout>
            <Routes>
              {['', '/en'].map((prefix) => (
                <Fragment key={prefix || 'zh'}>
                  <Route path={`${prefix}/`} element={<HomePage />} />
                  {on('about') && <Route path={`${prefix}/about`} element={<AboutPage />} />}
                  {on('projects') && <Route path={`${prefix}/projects`} element={<ProjectsPage />} />}
                  {on('publications') && <Route path={`${prefix}/publications`} element={<PublicationsPage />} />}
                  {on('repositories') && <Route path={`${prefix}/repositories`} element={<RepositoriesPage />} />}
                  {on('cv') && <Route path={`${prefix}/cv`} element={<CvPage />} />}
                  <Route path={`${prefix}/projects/:id`} element={<ProjectDetailPage />} />
                  <Route path={`${prefix}/papers/:id`} element={<PublicationDetailPage />} />
                </Fragment>
              ))}
              {ContentReviewPage && (
                <Route
                  path={CONTENT_REVIEW_PATH}
                  element={
                    <Suspense fallback={null}>
                      <ContentReviewPage />
                    </Suspense>
                  }
                />
              )}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </MotionProvider>
      </SiteContext.Provider>
    </StrictMode>
  );
}
