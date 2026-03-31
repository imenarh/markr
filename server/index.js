import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleGrade } from './routes/ai.js';
import { handleGetThreads, handleCreateThread, handleGetResults } from './routes/threads.js';
import { handleParseRubric } from './routes/parse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.resolve(__dirname, '../client');
const host = process.env.HOST ?? '127.0.0.1';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

const MIME_TYPES = {
  '.css':  'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.txt':  'text/plain; charset=utf-8',
};

// API routes: [method, path] → handler(req) → { status, body }
const API_ROUTES = [
  ['POST', '/api/grade',          handleGrade],
  ['POST', '/api/parse',          handleParseRubric],
  ['GET',  '/api/threads',        handleGetThreads],
  ['POST', '/api/threads',        handleCreateThread],
];

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  // ── API ──
  if (pathname.startsWith('/api/')) {
    // Match static routes first, then pattern routes like /api/threads/:id/results
    const route = API_ROUTES.find(([m, p]) => m === req.method && p === pathname);
    const patternRoute = !route && matchPattern(req.method, pathname);
    if (!route && !patternRoute) return sendJson(res, 404, { error: 'Not found' });

    try {
      req.body = await parseBody(req);
      const handler = route ? route[2] : patternRoute.handler;
      if (patternRoute) req.params = patternRoute.params;
      const { status, body } = await handler(req);
      sendJson(res, status, body);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Internal server error' });
    }
    return;
  }

  // ── Static files ──
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });

  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(clientDir, relative);

  if (!filePath.startsWith(clientDir)) return sendJson(res, 403, { error: 'Forbidden' });

  try {
    await access(filePath);
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) return sendJson(res, 404, { error: 'Not found' });

    res.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    createReadStream(filePath).pipe(res);
  } catch {
    sendJson(res, 404, { error: 'Not found' });
  }
});

server.listen(port, host, () => {
  console.log(`Markr listening on http://${host}:${port}`);
});

// Matches routes with dynamic segments e.g. /api/threads/:id/results
const PATTERN_ROUTES = [
  { method: 'GET', pattern: /^\/api\/threads\/([^/]+)\/results$/, handler: handleGetResults, params: (m) => ({ id: m[1] }) },
];

function matchPattern(method, pathname) {
  for (const r of PATTERN_ROUTES) {
    if (r.method !== method) continue;
    const match = pathname.match(r.pattern);
    if (match) return { handler: r.handler, params: r.params(match) };
  }
  return null;
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function parseBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); }
      catch { resolve({}); }
    });
  });
}
