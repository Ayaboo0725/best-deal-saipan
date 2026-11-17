// Tiny zero-dependency static server for the exported site.
//   node scripts/serve.mjs [dir=out] [port=4321]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dir = path.resolve(process.argv[2] || 'out');
const port = Number(process.argv[3] || process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
};
const COMPRESS = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.xml']);

function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  const full = path.join(dir, p);
  if (!full.startsWith(dir)) return null;
  const tries = [full, path.join(full, 'index.html'), full + '.html'];
  for (const t of tries) {
    try {
      if (fs.statSync(t).isFile()) return t;
    } catch {}
  }
  return null;
}

http
  .createServer((req, res) => {
    let file = resolve(req.url || '/');
    let status = 200;
    if (!file) {
      // trailingSlash export: redirect /shop -> /shop/
      const p = (req.url || '/').split('?')[0];
      if (!p.endsWith('/') && !path.extname(p) && resolve(p + '/')) {
        res.writeHead(308, { Location: p + '/' + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '') });
        return res.end();
      }
      file = path.join(dir, '404.html');
      status = 404;
      if (!fs.existsSync(file)) {
        res.writeHead(404);
        return res.end('Not found');
      }
    }
    const ext = path.extname(file).toLowerCase();
    const headers = {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : file.includes(`${path.sep}_next${path.sep}static`) ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
    };
    const body = fs.readFileSync(file);
    if (COMPRESS.has(ext) && /\bbr\b/.test(req.headers['accept-encoding'] || '')) {
      headers['Content-Encoding'] = 'br';
      res.writeHead(status, headers);
      return res.end(zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }));
    }
    if (COMPRESS.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(status, headers);
      return res.end(zlib.gzipSync(body));
    }
    res.writeHead(status, headers);
    res.end(body);
  })
  .listen(port, () => console.log(`Serving ${dir} at http://localhost:${port}`));
