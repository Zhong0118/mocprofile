// Build-time static rendering. Runs after the client build (dist/) and the SSR build of
// src/entry-server.tsx (dist-server/). Writes one HTML file per public route, plus 404.html,
// sitemap.xml and robots.txt. dist-server/ is an intermediate artifact and is never deployed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverEntry = path.join(root, 'dist-server', 'entry-server.js');

const { render, content, buildRouteManifest, getPageMeta, validateContent, findTemplateResidue } = await import(
  pathToFileURL(serverEntry).href
);

// 1. Content checks fail the build: structure and references, then template residue.
const errors = [
  ...validateContent(content, { assetExists: (p) => fs.existsSync(path.join(root, 'public', p)) }),
  ...findTemplateResidue(content),
];
if (errors.length) {
  console.error('Content validation failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

// Preview deployments must not be indexed; production keeps the real canonical.
const isPreview = Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== 'production';

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// JSON inside <script>: escape characters that could close the element or break parsing.
const safeJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

function headTags(meta) {
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
  ];
  if (isPreview) tags.push('<meta name="robots" content="noindex, nofollow" />');
  if (meta.canonical) tags.push(`<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);
  for (const alt of meta.alternates) {
    tags.push(`<link rel="alternate" hreflang="${alt.hreflang}" href="${escapeHtml(alt.href)}" />`);
  }
  tags.push(
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(content.person.displayName)}" />`,
    `<meta property="og:locale" content="${meta.lang === 'en' ? 'en_US' : 'zh_CN'}" />`,
  );
  if (meta.canonical) tags.push(`<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`);
  tags.push('<meta name="twitter:card" content="summary" />');
  if (meta.jsonLd) tags.push(`<script type="application/ld+json">${safeJson(meta.jsonLd)}</script>`);
  return tags.join('\n    ');
}

// 2. One HTML document per manifest route.
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('dist/index.html is missing the app placeholders');
}
const manifest = buildRouteManifest(content);
for (const entry of manifest) {
  const meta = getPageMeta(content, entry, entry.locale);
  const appHtml = render(entry.path);
  const html = template
    .replace('<html lang="zh-CN">', `<html lang="${meta.lang}">`)
    .replace('<!--app-head-->', headTags(meta))
    .replace('<!--app-html-->', appHtml);
  const file = path.join(dist, entry.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// 3. Standalone 404: no app bundle, no hydration, readable without JS, never in the sitemap.
const zhUi = content.locales.zh.ui.notFound;
const enUi = content.locales.en.ui.notFound;
const notFound = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <meta name="color-scheme" content="light dark" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>404 · ${escapeHtml(zhUi.title)} / ${escapeHtml(enUi.title)}</title>
    <style>
      :root { color-scheme: light dark; --bg: #fff; --fg: #17202b; --muted: #566170; --link: #1d4ed8; --sep: #e3e7ed; }
      @media (prefers-color-scheme: dark) { :root { --bg: #111418; --fg: #edf0f4; --muted: #a6afbb; --link: #8ab4ff; --sep: #2b313b; } }
      body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.75 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif; }
      main { max-width: 640px; margin: 0 auto; padding: 64px 20px; }
      h1 { font-size: 26px; line-height: 1.35; font-weight: 600; margin: 0 0 8px; }
      h2 { font-size: 20px; line-height: 1.4; font-weight: 600; margin: 0 0 8px; }
      p { margin: 0 0 12px; }
      .code { color: var(--muted); font-size: 14px; margin-bottom: 4px; }
      section + section { border-top: 1px solid var(--sep); margin-top: 32px; padding-top: 32px; }
      a { color: var(--link); text-decoration: underline; text-underline-offset: 3px; }
      a:focus-visible { outline: 2px solid var(--link); outline-offset: 2px; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <p class="code">HTTP 404</p>
        <h1>${escapeHtml(zhUi.title)}</h1>
        <p>${escapeHtml(zhUi.description)}</p>
        <p><a href="/">${escapeHtml(zhUi.home)}</a></p>
      </section>
      <section lang="en">
        <h2>${escapeHtml(enUi.title)}</h2>
        <p>${escapeHtml(enUi.description)}</p>
        <p><a href="/en/">${escapeHtml(enUi.home)}</a></p>
      </section>
    </main>
  </body>
</html>
`;
fs.writeFileSync(path.join(dist, '404.html'), notFound);

// 4. Sitemap and robots from the same manifest.
const site = content.site.url;
const lastmod = content.site.updatedAt;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${manifest
  .map(
    (e) => `  <url>
    <loc>${site}${e.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${site}${e.alternates.zh}" />
    <xhtml:link rel="alternate" hreflang="en" href="${site}${e.alternates.en}" />
  </url>`,
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  isPreview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`,
);

console.log(`Prerendered ${manifest.length} routes${isPreview ? ' (preview: noindex)' : ''}:`);
for (const e of manifest) console.log(`  ${e.path}`);
