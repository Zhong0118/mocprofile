// Local static server that mirrors the Vercel rules in vercel.json closely enough for checks:
// trailingSlash: true (308 for extension-less paths), directory index.html, and dist/404.html
// served with a real HTTP 404 for anything that does not exist. No SPA fallback.
import http from 'node:http';
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

function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return send(res, 400, path.join(dist, '404.html'));
    }
    const file = path.normalize(path.join(dist, pathname));
    if (!file.startsWith(dist)) return send(res, 404, path.join(dist, '404.html'));

    if (!pathname.endsWith('/') && !path.extname(pathname)) {
      res.writeHead(308, { Location: `${url.pathname}/${url.search}` });
      return res.end();
    }
    const target = pathname.endsWith('/') ? path.join(file, 'index.html') : file;
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return send(res, 200, target);
    return send(res, 404, path.join(dist, '404.html'));
  })
  .listen(port, () => console.log(`Serving dist/ on http://localhost:${port}`));
