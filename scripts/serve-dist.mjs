// Local static server that mirrors the Vercel rules in vercel.json closely enough for checks:
// trailingSlash: true (308 for extension-less paths), directory index.html, and dist/404.html
// served with a real HTTP 404 for anything that does not exist. No SPA fallback.
// Like Vercel it gzips text responses and marks hashed /assets/ as immutable, so local Lighthouse runs
// are not dominated by transfer overhead the production host does not have.
import http from 'node:http';
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT ?? 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const compressible = /^(text\/|application\/(json|xml)|image\/svg)/;

function send(res, status, file, req) {
  const type = types[path.extname(file)] ?? 'application/octet-stream';
  const headers = { 'Content-Type': type };
  if (file.startsWith(path.join(dist, 'assets') + path.sep)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  const gzip = compressible.test(type) && /\bgzip\b/.test(req?.headers['accept-encoding'] ?? '');
  if (gzip) {
    headers['Content-Encoding'] = 'gzip';
    headers['Vary'] = 'Accept-Encoding';
  }
  res.writeHead(status, headers);
  const stream = fs.createReadStream(file);
  (gzip ? stream.pipe(zlib.createGzip()) : stream).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return send(res, 400, path.join(dist, '404.html'), req);
    }
    const file = path.normalize(path.join(dist, pathname));
    if (!file.startsWith(dist)) return send(res, 404, path.join(dist, '404.html'), req);

    if (!pathname.endsWith('/') && !path.extname(pathname)) {
      res.writeHead(308, { Location: `${url.pathname}/${url.search}` });
      return res.end();
    }
    const target = pathname.endsWith('/') ? path.join(file, 'index.html') : file;
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return send(res, 200, target, req);
    return send(res, 404, path.join(dist, '404.html'), req);
  })
  .listen(port, () => console.log(`Serving dist/ on http://localhost:${port}`));
