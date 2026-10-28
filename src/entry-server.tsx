// Build-time renderer. Used only by scripts/prerender.mjs; never deployed as a server.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { content } from '@site-content';
import { App } from './App';

export { content };
export { buildRouteManifest, matchRoute } from '@/routing/manifest';
export { getPageMeta } from '@/routing/meta';
export { validateContent, TEMPLATE_MARKERS } from '@/content/validate';

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App bundle={content} />
    </StaticRouter>,
  );
}
