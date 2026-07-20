import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from '../index.js';

async function withTestServer(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'agropredict-'));
  const dbPath = join(dir, 'test.db');
  const app = createServer({ dbPath });
  await new Promise((resolve) => app.listen(0, '127.0.0.1', resolve));
  const { port } = app.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await fn(baseUrl);
  } finally {
    await new Promise((resolve) => app.close(resolve));
    await rm(dir, { recursive: true, force: true });
  }
}

async function json(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json();
  return { response, body };
}

test('API supports farms, crop prediction, price prediction, chat, and admin summary', async () => {
  await withTestServer(async (baseUrl) => {
    const created = await json(`${baseUrl}/api/farms`, {
      method: 'POST',
      body: JSON.stringify({
        farm_name: 'Demo Farm',
        location: 'Surat, Gujarat',
        state: 'Gujarat',
        district: 'Surat',
        city: 'Bardoli',
        region: 'west_coastal',
        soil_type: 'alluvial',
        water_source: 'canal',
        water_availability: 'abundant',
        climate_zone: 'tropical',
        irrigation_type: 'flood',
        soil_ph: 6.5,
      }),
    });

    assert.equal(created.response.status, 201);
    assert.equal(created.body.farm_name, 'Demo Farm');
    assert.equal(created.body.state, 'Gujarat');
    assert.equal(created.body.region, 'west_coastal');

    const farms = await json(`${baseUrl}/api/farms`);
    assert.equal(farms.body.length, 1);

    const locations = await json(`${baseUrl}/api/location-knowledge`);
    assert.ok(locations.body.states.includes('Gujarat'));
    assert.ok(locations.body.stateProfiles.Gujarat.districts.includes('Surat'));

    const prediction = await json(`${baseUrl}/api/predictions/crop`, {
      method: 'POST',
      body: JSON.stringify({ farm_id: created.body.id, season: 'kharif' }),
    });

    assert.equal(prediction.response.status, 201);
    assert.equal(prediction.body.predictions[0].crop_name, 'Rice');

    const price = await json(`${baseUrl}/api/predictions/price`, {
      method: 'POST',
      body: JSON.stringify({ crop: 'Rice', market: 'National Market', season: 'Kharif', quantity: 20 }),
    });

    assert.equal(price.response.status, 201);
    assert.equal(price.body.total_revenue, price.body.current_price * 20);

    const chat = await json(`${baseUrl}/api/chat`, {
      method: 'POST',
      body: JSON.stringify({ message: 'How to save water in Gujarati farm?', language: 'en' }),
    });

    assert.equal(chat.response.status, 201);
    assert.ok(chat.body.answer.toLowerCase().includes('drip') || chat.body.answer.toLowerCase().includes('water'));

    const blockedAdmin = await json(`${baseUrl}/api/admin/summary`);
    assert.equal(blockedAdmin.response.status, 401);

    const admin = await json(`${baseUrl}/api/admin/summary`, {
      headers: { 'x-admin-key': 'admin123' },
    });
    assert.equal(admin.body.stats.farms, 1);
    assert.equal(admin.body.stats.crop_predictions, 1);
    assert.equal(admin.body.stats.price_predictions, 1);
    assert.equal(admin.body.stats.chat_logs, 1);
    assert.ok(admin.body.cropKnowledge.length >= 5);
  });
});
