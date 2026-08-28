import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve('dist/site');
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.zip': 'application/zip'
};

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  const relative = pathname.endsWith('/')
    ? `${pathname}index.html`
    : extname(pathname) ? pathname : `${pathname}/index.html`;
  const target = resolve(root, `.${relative}`);
  const safeTarget = target.startsWith(`${root}${sep}`) ? target : resolve(root, '404.html');
  try {
    const body = await readFile(safeTarget);
    response.writeHead(200, { 'Content-Type': types[extname(safeTarget)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    const body = await readFile(resolve(root, '404.html'));
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(body);
  }
}).listen(4173, '127.0.0.1');
