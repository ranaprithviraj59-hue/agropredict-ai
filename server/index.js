import { createServer as createHttpServer } from 'node:http';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDatabase } from './db.js';
import { handleApi } from './routes.js';

export function createServer({ dbPath } = {}) {
  const db = createDatabase(dbPath);
  const server = createHttpServer((req, res) => {
    if (req.url?.startsWith('/api/')) {
      handleApi(req, res, db);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Use /api routes' }));
  });
  server.on('close', () => db.close());
  return server;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const port = Number(process.env.PORT || 4000);
  const server = createServer();
  server.listen(port, () => {
    console.log(`AgroPredict API running on http://127.0.0.1:${port}`);
  });
}
