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
  assert.ok(result.market_factors.length >= 3);
  assert.ok(result.best_sell_time.length > 0);
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
