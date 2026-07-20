import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { cropKnowledge } from './data/cropKnowledge.js';

const json = (value) => JSON.stringify(value);
const parse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export function createDatabase(dbPath = 'server/data/agropredict.db') {
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS farms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farm_name TEXT NOT NULL,
      location TEXT,
      state TEXT,
      district TEXT,
      city TEXT,
      region TEXT,
      latitude REAL,
      longitude REAL,
      farm_size_acres REAL,
      soil_type TEXT NOT NULL,
      water_source TEXT NOT NULL,
      water_availability TEXT NOT NULL,
      climate_zone TEXT,
      irrigation_type TEXT,
      soil_ph REAL,
      ph REAL,
      n_level REAL,
      p_level REAL,
      k_level REAL,
      temperature REAL,
      humidity REAL,
      rainfall REAL,
      organic_matter_percent REAL,
      previous_crop TEXT,
      farming_experience_years REAL,
      created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS crop_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farm_id INTEGER NOT NULL,
      season TEXT NOT NULL,
      predictions_json TEXT NOT NULL,
      recommendation_notes TEXT,
      weather_summary TEXT,
      created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS price_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop TEXT NOT NULL,
      market TEXT NOT NULL,
      season TEXT NOT NULL,
      quantity REAL,
      result_json TEXT NOT NULL,
      created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chat_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      language TEXT,
      message TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS crop_knowledge (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop_name TEXT NOT NULL UNIQUE,
      data_json TEXT NOT NULL
    );
  `);

  const farmColumns = db.prepare('PRAGMA table_info(farms)').all().map((column) => column.name);
  const extraCols = [
    ['state', 'TEXT'], ['district', 'TEXT'], ['city', 'TEXT'], ['region', 'TEXT'],
    ['ph', 'REAL'], ['n_level', 'REAL'], ['p_level', 'REAL'], ['k_level', 'REAL'],
    ['temperature', 'REAL'], ['humidity', 'REAL'], ['rainfall', 'REAL']
  ];
  for (const [name, type] of extraCols) {
    if (!farmColumns.includes(name)) db.exec(`ALTER TABLE farms ADD COLUMN ${name} ${type}`);
  }

  const count = db.prepare('SELECT COUNT(*) AS count FROM crop_knowledge').get().count;
  if (count === 0) {
    const insert = db.prepare('INSERT INTO crop_knowledge (crop_name, data_json) VALUES (?, ?)');
    for (const crop of cropKnowledge) insert.run(crop.crop_name, json(crop));
  }

  return db;
}

export function getCropKnowledge(db) {
  return db.prepare('SELECT data_json FROM crop_knowledge ORDER BY crop_name').all().map((row) => parse(row.data_json));
}

export function rowToFarm(row) {
  return row ? { ...row, id: Number(row.id) } : null;
}

export function rowToCropPrediction(row) {
  return row ? {
    id: Number(row.id),
    farm_id: Number(row.farm_id),
    season: row.season,
    predictions: parse(row.predictions_json, []),
    recommendation_notes: row.recommendation_notes,
    weather_summary: row.weather_summary,
    created_date: row.created_date,
  } : null;
}

export function rowToPricePrediction(row) {
  return row ? {
    id: Number(row.id),
    ...parse(row.result_json, {}),
    crop: row.crop,
    market: row.market,
    season: row.season,
    quantity: row.quantity,
    created_date: row.created_date,
  } : null;
}

export function rowToChatLog(row) {
  return row ? {
    id: Number(row.id),
    language: row.language,
    message: row.message,
    answer: row.answer,
    created_date: row.created_date,
  } : null;
}

export { json };
