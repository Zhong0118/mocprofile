// Checks the built static output (dist/) without running any JavaScript in a browser:
// prerendered body text and metadata per route, no template or fixture residue, standalone 404,
// sitemap ↔ manifest consistency, PDF validity, no server artifacts, and bundle sizes.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { content, buildRouteManifest, getPageMeta, TEMPLATE_MARKERS } = await import(
  pathToFileURL(path.join(root, 'dist-server', 'entry-server.js')).href
);

const failures = [];
const fail = (msg) => failures.push(msg);
const read = (p) => fs.readFileSync(p, 'utf8');
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
const bodyText = (html) => {
  const root = html.slice(html.indexOf('<div id="root">'));
  return decode(root.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
};

const manifest = buildRouteManifest(content);
const files = walk(dist);

// --- per-route HTML -------------------------------------------------------------------------
for (const entry of manifest) {
  const file = path.join(dist, entry.path, 'index.html');
  if (!fs.existsSync(file)) {
    fail(`${entry.path}: missing prerendered file`);
    continue;
  }
  const html = read(file);
  const meta = getPageMeta(content, entry, entry.locale);
  const text = bodyText(html);
  const t = content.locales[entry.locale];
  const expect = (cond, msg) => cond || fail(`${entry.path}: ${msg}`);

  expect(html.includes(`<html lang="${meta.lang}"`), `html lang is not ${meta.lang}`);
  expect(decode(html).includes(`<title>${meta.title}</title>`), 'title missing from initial HTML');
  expect(decode(html).includes(`<meta name="description" content="${meta.description}"`), 'description missing');
  expect(html.includes(`<link rel="canonical" href="${content.site.url}${entry.path}"`), 'canonical is not self-referencing');
  for (const alt of meta.alternates) {
    expect(html.includes(`hreflang="${alt.hreflang}" href="${alt.href}"`), `alternate ${alt.hreflang} missing`);
  }
  expect(html.includes(`property="og:url" content="${content.site.url}${entry.path}"`), 'og:url missing');
  expect((html.match(/<h1[\s>]/g) ?? []).length === 1, 'must contain exactly one <h1>');
  expect(!html.includes('<!--app-html-->') && !html.includes('<!--app-head-->'), 'unfilled placeholder');

  const modules = t.ui.modules;
  if (entry.kind === 'home') {
    expect(text.includes(content.person.displayName), 'display name not in body');
    expect(text.includes(t.person.intro.slice(0, 20)), 'introduction not in body');
    for (const p of content.projects.filter((p) => p.homepageOrder !== undefined)) {
      expect(text.includes(p.name), `featured project ${p.name} not in body`);
    }
    // Every enabled module is present, with entries or an empty state.
    for (const [id, title] of Object.entries(modules)) {
      if (id === 'about' || !content.site.modules[id].enabled) continue;
      expect(text.includes(title), `module "${id}" missing from the homepage`);
    }
    for (const anchor of ['about', 'research', 'projects', 'publications', 'skills', 'github', 'experience', 'awards', 'cv', 'contact']) {
      expect(html.includes(`id="${anchor}"`), `homepage anchor #${anchor} missing`);
    }
  }
  if (entry.kind === 'about') {
    for (const anchor of ['skills', 'education', 'experience', 'awards', 'contact']) {
      expect(html.includes(`id="${anchor}"`), `about anchor #${anchor} missing`);
    }
  }
  if (entry.kind === 'projects') {
    for (const p of content.projects) expect(text.includes(p.name), `directory misses project ${p.name}`);
  }
  if (entry.kind === 'repositories') {
    for (const r of content.repositories) expect(text.includes(r.name), `repositories page misses ${r.name}`);
  }
  if (entry.kind === 'publications') {
    if (content.publications.length === 0) expect(text.includes(t.ui.emptyState), 'empty publications page lacks the empty state');
    for (const p of content.publications) expect(text.includes(p.originalTitle), `publications page misses ${p.id}`);
  }
  if (entry.kind === 'cv') {
    for (const p of content.projects) expect(text.includes(p.name), `CV misses project ${p.name}`);
    for (const p of content.publications) expect(text.includes(p.originalTitle), `CV misses publication ${p.id}`);
  }
  // Prerendered content must be visible without JavaScript: nothing parked at opacity 0.
  expect(!/style="[^"]*opacity:\s*0[;"]/.test(html), 'content rendered with opacity 0');
  if (entry.kind === 'project') {
    const p = content.projects.find((x) => x.id === entry.id);
    expect(text.includes(p.name), 'project name not in body');
    for (const s of t.projects[p.id].sections ?? []) expect(text.includes(s.heading), `section "${s.heading}" missing`);
  }
  if (entry.kind === 'publication') {
    const p = content.publications.find((x) => x.id === entry.id);
    expect(text.includes(p.originalTitle), 'publication title not in body');
  }
}

// --- residue and artifacts -------------------------------------------------------------------
for (const file of files) {
  const rel = path.relative(dist, file);
  if (/entry-server|dist-server/.test(rel)) fail(`server artifact in dist: ${rel}`);
  if (/fixture/i.test(rel)) fail(`fixture file in dist: ${rel}`);
  if (!/\.(html|js|css|xml|txt|json|svg)$/.test(file)) continue;
  const body = read(file);
  for (const marker of TEMPLATE_MARKERS) if (body.includes(marker)) fail(`${rel}: contains template marker "${marker}"`);
  if (body.includes('fixture.invalid')) fail(`${rel}: contains fixture data`);
  if (body.includes('__content-review__') || body.includes('Content review')) fail(`${rel}: contains the dev-only review page`);
  if (/stargazers|"stars"/.test(body)) fail(`${rel}: contains repository popularity metrics`);
  if (rel.endsWith('.html') && body.includes('/vite.svg')) fail(`${rel}: references /vite.svg`);
  // Tailwind's built-in page-width utility (width: 100%) would fight the padded .page-wrap and overflow.
  // The class name is assembled so that Tailwind's source scan does not pick it up from this file.
  const twWidthUtility = ['contain', 'er'].join('');
  if (rel.endsWith('.css') && body.includes(`.${twWidthUtility}{`)) fail(`${rel}: emits Tailwind's ${twWidthUtility} utility; use .page-wrap`);
}

// --- 404 ------------------------------------------------------------------------------------
const notFoundFile = path.join(dist, '404.html');
if (!fs.existsSync(notFoundFile)) fail('dist/404.html missing');
else {
  const html = read(notFoundFile);
  if (/<script/i.test(html)) fail('404.html must not load scripts');
  if (/rel="canonical"/.test(html)) fail('404.html must not declare a canonical');
  if (!html.includes('href="/"') || !html.includes('href="/en/"')) fail('404.html needs links to / and /en/');
}

// --- sitemap / robots -----------------------------------------------------------------------
const sitemap = read(path.join(dist, 'sitemap.xml'));
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const expected = manifest.map((e) => `${content.site.url}${e.path}`);
if (locs.join() !== expected.join()) fail(`sitemap does not match manifest:\n  ${locs.join('\n  ')}`);
if (locs.some((l) => l.includes('404'))) fail('sitemap lists the 404 page');
const robots = read(path.join(dist, 'robots.txt'));
if (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production') {
  if (!robots.includes(`Sitemap: ${content.site.url}/sitemap.xml`) || robots.includes('Disallow: /\n')) {
    fail('production robots.txt must allow crawling and point to the sitemap');
  }
}

// --- CV PDF ---------------------------------------------------------------------------------
const pdfs = Object.values(content.cv.pdf ?? {}).filter(Boolean);
for (const pdf of pdfs) {
  const file = path.join(dist, pdf.href);
  if (!fs.existsSync(file)) fail(`CV PDF ${pdf.href} missing from dist`);
  else if (fs.readFileSync(file).subarray(0, 5).toString('latin1') !== '%PDF-') fail(`${pdf.href} is not a PDF file`);
}
if (pdfs.length === 0) {
  for (const file of files.filter((f) => f.endsWith('.html'))) {
    const html = read(file);
    if (/下载 PDF|Download PDF|Download Chinese PDF|下载英文 PDF/.test(html)) {
      fail(`${path.relative(dist, file)}: shows a PDF download without a PDF`);
    }
  }
}

// --- sizes ----------------------------------------------------------------------------------
const gz = (file) => zlib.gzipSync(fs.readFileSync(file)).length;
const homeHtml = read(path.join(dist, 'index.html'));
const linked = (re) => [...homeHtml.matchAll(re)].map((m) => path.join(dist, m[1]));
const initialJs = linked(/<script type="module"[^>]*src="([^"]+)"/g).concat(linked(/<link rel="modulepreload"[^>]*href="([^"]+)"/g));
const css = linked(/<link rel="stylesheet"[^>]*href="([^"]+)"/g);
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const jsGz = initialJs.reduce((s, f) => s + gz(f), 0);
const cssGz = css.reduce((s, f) => s + gz(f), 0);
console.log(`Initial JS (gzip): ${kb(jsGz)} across ${initialJs.length} file(s); budget 160 KB`);
console.log(`CSS (gzip): ${kb(cssGz)}; budget 30 KB`);
if (jsGz > 160 * 1024) console.warn('  ! initial JS exceeds the 160 KB budget');
if (cssGz > 30 * 1024) console.warn('  ! CSS exceeds the 30 KB budget');

if (failures.length) {
  console.error(`check-dist: ${failures.length} problem(s)\n` + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log(`check-dist: ${manifest.length} routes, 404, sitemap and assets OK`);
