import { getCropKnowledge, json, rowToChatLog, rowToCropPrediction, rowToFarm, rowToPricePrediction } from './db.js';
import { locationKnowledge } from './data/locationKnowledge.js';
import { predictCrops } from './services/cropEngine.js';
import { predictPrice } from './services/priceEngine.js';
import { generateKisanAiResponse } from './services/kisanAiService.js';

const send = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  });
  res.end(JSON.stringify(body));
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
};

const required = (body, fields) => fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
const adminKey = () => process.env.ADMIN_KEY || 'admin123';

const isAdminRequest = (req) => req.headers['x-admin-key'] === adminKey();

const chatTitle = (message) => String(message || 'Kisan AI Chat').trim().slice(0, 70) || 'Kisan AI Chat';

const getChatHistory = (db, conversationId) => {
  if (!conversationId) return [];
  const rows = db.prepare('SELECT message, answer FROM chat_logs WHERE conversation_id = ? ORDER BY created_date ASC, id ASC').all(conversationId);
  return rows.flatMap((row) => [
    { role: 'user', content: row.message },
    { role: 'assistant', content: row.answer },
  ]);
};

const ensureConversation = (db, { conversationId, message, language }) => {
  if (conversationId) {
    const existing = db.prepare('SELECT id FROM chat_conversations WHERE id = ?').get(conversationId);
    if (existing) return Number(existing.id);
  }

  const created = db.prepare('INSERT INTO chat_conversations (title, language) VALUES (?, ?)').run(chatTitle(message), language || 'en');
  return Number(created.lastInsertRowid);
};

export async function handleApi(req, res, db, liveServices = {}) {
  if (req.method === 'OPTIONS') return send(res, 204, {});

  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  try {
    if (path === '/api/health' && req.method === 'GET') {
      return send(res, 200, { ok: true, service: 'AgroPredict API' });
    }

    if (path === '/api/location-knowledge' && req.method === 'GET') {
      return send(res, 200, locationKnowledge);
    }

    if (path === '/api/farms' && req.method === 'GET') {
      const farms = db.prepare('SELECT * FROM farms ORDER BY created_date DESC, id DESC').all().map(rowToFarm);
      return send(res, 200, farms);
    }

    if (path === '/api/farms' && req.method === 'POST') {
      const body = await readBody(req);
      const missing = required(body, ['farm_name', 'soil_type', 'water_source', 'water_availability']);
      if (missing.length) return send(res, 400, { error: `Missing required fields: ${missing.join(', ')}` });
      const phVal = body.ph !== undefined && body.ph !== null && body.ph !== '' ? Number(body.ph) : (body.soil_ph ? Number(body.soil_ph) : null);
      const result = db.prepare(`
        INSERT INTO farms (
          farm_name, location, state, district, city, region, latitude, longitude, farm_size_acres, soil_type, water_source,
          water_availability, climate_zone, irrigation_type, soil_ph, ph, n_level, p_level, k_level, temperature, humidity, rainfall,
          organic_matter_percent, previous_crop, farming_experience_years
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        body.farm_name, body.location || null, body.state || null, body.district || null,
        body.city || null, body.region || null, body.latitude || null, body.longitude || null,
        body.farm_size_acres || null, body.soil_type, body.water_source, body.water_availability,
        body.climate_zone || null, body.irrigation_type || null, phVal, phVal,
        body.n_level !== undefined && body.n_level !== '' ? Number(body.n_level) : null,
        body.p_level !== undefined && body.p_level !== '' ? Number(body.p_level) : null,
        body.k_level !== undefined && body.k_level !== '' ? Number(body.k_level) : null,
        body.temperature !== undefined && body.temperature !== '' ? Number(body.temperature) : null,
        body.humidity !== undefined && body.humidity !== '' ? Number(body.humidity) : null,
        body.rainfall !== undefined && body.rainfall !== '' ? Number(body.rainfall) : null,
        body.organic_matter_percent || null, body.previous_crop || null, body.farming_experience_years || null
      );
      const farm = db.prepare('SELECT * FROM farms WHERE id = ?').get(result.lastInsertRowid);
      return send(res, 201, rowToFarm(farm));
    }

    const farmMatch = path.match(/^\/api\/farms\/(\d+)$/);
    if (farmMatch && req.method === 'PUT') {
      const id = Number(farmMatch[1]);
      const body = await readBody(req);
      const phVal = body.ph !== undefined && body.ph !== null && body.ph !== '' ? Number(body.ph) : (body.soil_ph ? Number(body.soil_ph) : null);
      db.prepare(`
        UPDATE farms SET
          farm_name = ?, location = ?, latitude = ?, longitude = ?, farm_size_acres = ?,
          state = ?, district = ?, city = ?, region = ?, soil_type = ?, water_source = ?, water_availability = ?, climate_zone = ?,
          irrigation_type = ?, soil_ph = ?, ph = ?, n_level = ?, p_level = ?, k_level = ?, temperature = ?, humidity = ?, rainfall = ?,
          organic_matter_percent = ?, previous_crop = ?, farming_experience_years = ?
        WHERE id = ?
      `).run(
        body.farm_name, body.location || null, body.latitude || null, body.longitude || null,
        body.farm_size_acres || null, body.state || null, body.district || null, body.city || null,
        body.region || null, body.soil_type, body.water_source, body.water_availability,
        body.climate_zone || null, body.irrigation_type || null, phVal, phVal,
        body.n_level !== undefined && body.n_level !== '' ? Number(body.n_level) : null,
        body.p_level !== undefined && body.p_level !== '' ? Number(body.p_level) : null,
        body.k_level !== undefined && body.k_level !== '' ? Number(body.k_level) : null,
        body.temperature !== undefined && body.temperature !== '' ? Number(body.temperature) : null,
        body.humidity !== undefined && body.humidity !== '' ? Number(body.humidity) : null,
        body.rainfall !== undefined && body.rainfall !== '' ? Number(body.rainfall) : null,
        body.organic_matter_percent || null, body.previous_crop || null, body.farming_experience_years || null,
        id
      );
      return send(res, 200, rowToFarm(db.prepare('SELECT * FROM farms WHERE id = ?').get(id)));
    }

    if (farmMatch && req.method === 'DELETE') {
      db.prepare('DELETE FROM farms WHERE id = ?').run(Number(farmMatch[1]));
      return send(res, 200, { ok: true });
    }

    if (path === '/api/predictions/crop' && req.method === 'GET') {
      const rows = db.prepare('SELECT * FROM crop_predictions ORDER BY created_date DESC, id DESC').all().map(rowToCropPrediction);
      return send(res, 200, rows);
    }

    if (path === '/api/predictions/crop' && req.method === 'POST') {
      const body = await readBody(req);
      const farm = rowToFarm(db.prepare('SELECT * FROM farms WHERE id = ?').get(body.farm_id));
      if (!farm) return send(res, 404, { error: 'Farm not found' });
      let weather = null;
      try {
        weather = await liveServices.getWeatherForFarm?.(farm);
      } catch (error) {
        console.warn(`Live weather unavailable: ${error.message}`);
      }
      const result = predictCrops(farm, body.season, getCropKnowledge(db), weather);
      const saved = db.prepare(`
        INSERT INTO crop_predictions (farm_id, season, predictions_json, recommendation_notes, weather_summary)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        farm.id,
        body.season,
        json(result.predictions),
        result.recommendation_notes,
        weather ? json(weather) : 'Local climate profile based on farm data'
      );
      return send(res, 201, {
        id: Number(saved.lastInsertRowid),
        farm_id: farm.id,
        season: body.season,
        ...result,
      });
    }

    const cropPredictionMatch = path.match(/^\/api\/predictions\/crop\/(\d+)$/);
    if (cropPredictionMatch && req.method === 'DELETE') {
      db.prepare('DELETE FROM crop_predictions WHERE id = ?').run(Number(cropPredictionMatch[1]));
      return send(res, 200, { ok: true });
    }

    if (path === '/api/predictions/price' && req.method === 'GET') {
      const rows = db.prepare('SELECT * FROM price_predictions ORDER BY created_date DESC, id DESC').all().map(rowToPricePrediction);
      return send(res, 200, rows);
    }

    if (path === '/api/predictions/price' && req.method === 'POST') {
      const body = await readBody(req);
      const missing = required(body, ['crop', 'market', 'season']);
      if (missing.length) return send(res, 400, { error: `Missing required fields: ${missing.join(', ')}` });
      let liveMarket = null;
      try {
        liveMarket = await liveServices.getLiveMandiPrice?.(body);
      } catch (error) {
        console.warn(`Live mandi price unavailable: ${error.message}`);
      }
      const result = predictPrice({ ...body, liveMarket });
      const saved = db.prepare(`
        INSERT INTO price_predictions (crop, market, season, quantity, result_json)
        VALUES (?, ?, ?, ?, ?)
      `).run(body.crop, body.market, body.season, body.quantity || null, json(result));
      return send(res, 201, { id: Number(saved.lastInsertRowid), ...result });
    }

    if (path === '/api/chat' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.message) return send(res, 400, { error: 'Message is required' });

      const conversationId = ensureConversation(db, {
        conversationId: body.conversation_id,
        message: body.message,
        language: body.language,
      });
      const history = getChatHistory(db, conversationId);
      const aiResult = await generateKisanAiResponse({
        message: body.message,
        language: body.language || 'en',
        history,
      });
      const answer = aiResult.answer;

      const saved = db.prepare(`
        INSERT INTO chat_logs (conversation_id, language, message, answer, provider, model)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(conversationId, body.language || 'en', body.message, answer, aiResult.provider, aiResult.model);
      db.prepare('UPDATE chat_conversations SET updated_date = CURRENT_TIMESTAMP WHERE id = ?').run(conversationId);

      return send(res, 201, {
        id: Number(saved.lastInsertRowid),
        conversation_id: conversationId,
        answer,
        provider: aiResult.provider,
        model: aiResult.model,
      });
    }

    if (path === '/api/chat/conversations' && req.method === 'GET') {
      const language = url.searchParams.get('language');
      const rows = db.prepare(`
        SELECT c.id, c.title, c.language, c.created_date, c.updated_date, COUNT(l.id) AS message_count
        FROM chat_conversations c
        LEFT JOIN chat_logs l ON l.conversation_id = c.id
        ${language ? 'WHERE c.language = ?' : ''}
        GROUP BY c.id
        ORDER BY c.updated_date DESC, c.id DESC
      `).all(...(language ? [language] : []));
      return send(res, 200, rows.map((row) => ({
        ...row,
        id: Number(row.id),
        message_count: Number(row.message_count || 0) * 2,
      })));
    }

    const chatHistoryMatch = path.match(/^\/api\/chat\/history\/(\d+)$/);
    if (chatHistoryMatch && req.method === 'GET') {
      return send(res, 200, getChatHistory(db, Number(chatHistoryMatch[1])));
    }

    if (path === '/api/admin/summary' && req.method === 'GET') {
      if (!isAdminRequest(req)) return send(res, 401, { error: 'Admin access required' });

      const stats = {
        farms: db.prepare('SELECT COUNT(*) AS count FROM farms').get().count,
        crop_predictions: db.prepare('SELECT COUNT(*) AS count FROM crop_predictions').get().count,
        price_predictions: db.prepare('SELECT COUNT(*) AS count FROM price_predictions').get().count,
        chat_logs: db.prepare('SELECT COUNT(*) AS count FROM chat_logs').get().count,
        crop_knowledge: db.prepare('SELECT COUNT(*) AS count FROM crop_knowledge').get().count,
      };
      return send(res, 200, {
        stats,
        farms: db.prepare('SELECT * FROM farms ORDER BY created_date DESC, id DESC LIMIT 20').all().map(rowToFarm),
        cropPredictions: db.prepare('SELECT * FROM crop_predictions ORDER BY created_date DESC, id DESC LIMIT 20').all().map(rowToCropPrediction),
        pricePredictions: db.prepare('SELECT * FROM price_predictions ORDER BY created_date DESC, id DESC LIMIT 20').all().map(rowToPricePrediction),
        chatLogs: db.prepare('SELECT * FROM chat_logs ORDER BY created_date DESC, id DESC LIMIT 20').all().map(rowToChatLog),
        cropKnowledge: getCropKnowledge(db),
      });
    }

    return send(res, 404, { error: 'Route not found' });
  } catch (error) {
    console.error(error);
    return send(res, 500, { error: error.message || 'Internal server error' });
  }
}
