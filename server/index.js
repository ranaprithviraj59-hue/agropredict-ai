import { createServer as createHttpServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLocalEnv } from './env.js';
import { createDatabase } from './db.js';
import { handleApi } from './routes.js';
import { getLiveMandiPrice, getWeatherForFarm } from './services/liveData.js';

const serverDir = dirname(fileURLToPath(import.meta.url));
loadLocalEnv(resolve(serverDir, '..', '.env'));

export function createServer({ dbPath, liveServices = { getWeatherForFarm, getLiveMandiPrice } } = {}) {
  const db = createDatabase(dbPath);
  const server = createHttpServer((req, res) => {
    if (req.url?.startsWith('/api/')) {
      handleApi(req, res, db, liveServices);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Use /api routes' }));
  });
  server.on('close', () => db.close());
  return server;
}

if (typeof process !== 'undefined' && process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const port = Number(process.env.PORT || 4000);
  const server = createServer();
  server.listen(port, () => {
    console.log(`AgroPredict API running on http://127.0.0.1:${port}`);
  });
}
