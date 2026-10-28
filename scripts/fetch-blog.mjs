// Manual snapshot of the public MocLab RSS feed. Run `pnpm snapshot:blog` when you want newer posts;
// the build never fetches the network, so an unavailable feed cannot break or slow a deploy.
// Only titles, links, dates and the short description are kept.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FEED = 'https://www.moclab.top/rss.xml';
const LIMIT = 4;
const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/generated/blog-feed.json');

const decode = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : undefined;
};

const res = await fetch(FEED, { signal: AbortSignal.timeout(10_000) });
if (!res.ok) throw new Error(`${FEED}: HTTP ${res.status}`);
const xml = await res.text();
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, LIMIT).map(([, item]) => {
  const url = tag(item, 'link');
  if (!url?.startsWith('https://')) throw new Error(`unexpected item link ${url}`);
  return {
    title: tag(item, 'title'),
    url,
    date: new Date(tag(item, 'pubDate')).toISOString().slice(0, 10),
    description: tag(item, 'description')?.replace(/<[^>]+>/g, '') || undefined,
  };
});

const snapshot = { source: FEED, retrievedAt: new Date().toISOString().slice(0, 10), items };
fs.writeFileSync(out, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Wrote ${items.length} posts to ${path.relative(process.cwd(), out)}`);
