import test from 'node:test';
import assert from 'node:assert/strict';
import { predictPrice } from '../services/priceEngine.js';

test('predictPrice returns forecast, revenue, and sell advice', () => {
  const result = predictPrice({
    crop: 'Wheat',
    market: 'National Market',
    season: 'Rabi',
    quantity: 40,
  });

  assert.equal(result.crop, 'Wheat');
  assert.ok(result.current_price > 1500);
  assert.equal(result.monthly_forecast.length, 6);
  assert.equal(result.total_revenue, result.current_price * 40);
  assert.equal(result.predicted_price_per_quintal, result.current_price);
  assert.equal(result.total_estimated_revenue, result.total_revenue);
  assert.deepEqual(result.monthly_trend, result.monthly_forecast);
  assert.ok(result.market_factors.length >= 3);
  assert.ok(result.best_sell_time.length > 0);
  assert.equal(result.data_source.type, 'local_estimate');
  assert.equal(result.is_live, false);
});

test('predictPrice uses stable fallback for unknown crops', () => {
  const result = predictPrice({
    crop: 'Dragon Fruit',
    market: 'Local Mandi',
    season: 'Year Round',
    quantity: '',
  });

  assert.equal(result.crop, 'Dragon Fruit');
  assert.ok(result.current_price > 0);
  assert.equal(result.total_revenue, null);
});

test('predictPrice uses live mandi modal price when supplied', () => {
  const result = predictPrice({
    crop: 'Rice',
    market: 'Local Mandi',
    season: 'Kharif',
    quantity: 10,
    liveMarket: {
      modal_price: 3125,
      min_price: 2900,
      max_price: 3400,
      market: 'Surat',
      state: 'Gujarat',
      district: 'Surat',
      arrival_date: '20/07/2026',
      source_url: 'https://api.data.gov.in/resource/demo',
    },
  });

  assert.equal(result.current_price, 3125);
  assert.equal(result.predicted_price_per_quintal, 3125);
  assert.equal(result.min_price, 2900);
  assert.equal(result.max_price, 3400);
  assert.equal(result.total_revenue, 31250);
  assert.equal(result.total_estimated_revenue, 31250);
  assert.equal(result.is_live, true);
  assert.equal(result.data_source.type, 'live_mandi');
  assert.equal(result.data_source.market, 'Surat');
});
