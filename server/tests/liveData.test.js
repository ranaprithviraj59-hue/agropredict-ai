import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA_GOV_SAMPLE_API_KEY, getLiveMandiPrice, getWeatherForFarm } from '../services/liveData.js';

test('getLiveMandiPrice uses the data.gov.in sample key when no API key is configured', async () => {
  let requestedUrl;
  const result = await getLiveMandiPrice({
    crop: 'Rice',
    state: 'Gujarat',
    district: 'Surat',
  }, {
    apiKey: '',
    fetchImpl: async (url) => {
      requestedUrl = new URL(url);
      return {
        ok: true,
        json: async () => ({
          records: [{
            state: 'Gujarat',
            district: 'Surat',
            market: 'Surat',
            commodity: 'Rice',
            arrival_date: '20/07/2026',
            min_price: '2900',
            max_price: '3400',
            modal_price: '3125',
          }],
        }),
      };
    },
  });

  assert.equal(requestedUrl.searchParams.get('api-key'), DATA_GOV_SAMPLE_API_KEY);
  assert.equal(result.modal_price, 3125);
  assert.equal(result.market, 'Surat');
});

test('getLiveMandiPrice falls back to a broader commodity lookup when exact filters are empty', async () => {
  const requestedUrls = [];
  const result = await getLiveMandiPrice({
    crop: 'Rice',
    state: 'Gujarat',
    district: 'Surat',
  }, {
    apiKey: DATA_GOV_SAMPLE_API_KEY,
    fetchImpl: async (url) => {
      requestedUrls.push(new URL(url));
      return {
        ok: true,
        json: async () => requestedUrls.length < 3
          ? { records: [] }
          : {
              records: [{
                state: 'Punjab',
                district: 'Amritsar',
                market: 'Amritsar',
                commodity: 'Rice',
                arrival_date: '20/07/2026',
                min_price: '2800',
                max_price: '3100',
                modal_price: '3000',
              }],
            },
      };
    },
  });

  assert.equal(requestedUrls.length, 3);
  assert.equal(requestedUrls[2].searchParams.get('filters[commodity]'), 'Rice');
  assert.equal(result.modal_price, 3000);
  assert.equal(result.match_level, 'commodity');
});

test('getWeatherForFarm geocodes city district state text when coordinates are missing', async () => {
  const requestedUrls = [];
  const result = await getWeatherForFarm({
    city: 'Bardoli',
    district: 'Surat',
    state: 'Gujarat',
  }, {
    fetchImpl: async (url) => {
      requestedUrls.push(new URL(url));
      if (requestedUrls.length === 1) {
        return {
          ok: true,
          json: async () => ({
            results: [{
              name: 'Bardoli',
              admin1: 'Gujarat',
              admin2: 'Surat',
              country_code: 'IN',
              latitude: 21.1229,
              longitude: 73.1115,
            }],
          }),
        };
      }
      return {
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 29,
            relative_humidity_2m: 82,
            precipitation: 1.5,
            wind_speed_10m: 9,
          },
          daily: {
            temperature_2m_max: [31],
            temperature_2m_min: [25],
          },
        }),
      };
    },
  });

  assert.equal(requestedUrls[0].origin, 'https://geocoding-api.open-meteo.com');
  assert.equal(requestedUrls[1].origin, 'https://api.open-meteo.com');
  assert.equal(result.source, 'Open-Meteo');
  assert.equal(result.location_source, 'geocoded');
  assert.equal(result.temperature_c, 29);
});

test('getWeatherForFarm retries geocoding with city name when full location has no match', async () => {
  const requestedUrls = [];
  const result = await getWeatherForFarm({
    city: 'Bardoli',
    district: 'Surat',
    state: 'Gujarat',
    latitude: null,
    longitude: null,
  }, {
    fetchImpl: async (url) => {
      requestedUrls.push(new URL(url));
      if (requestedUrls.length === 1) return { ok: true, json: async () => ({ results: [] }) };
      if (requestedUrls.length === 2) {
        return {
          ok: true,
          json: async () => ({
            results: [{ name: 'Bardoli', admin2: 'Surat District', admin1: 'Gujarat', latitude: 21.12297, longitude: 73.11151 }],
          }),
        };
      }
      return {
        ok: true,
        json: async () => ({
          current: { temperature_2m: 28, relative_humidity_2m: 84, precipitation: 0.4, wind_speed_10m: 7 },
          daily: { temperature_2m_max: [31], temperature_2m_min: [24] },
        }),
      };
    },
  });

  assert.equal(requestedUrls[0].searchParams.get('name'), 'Bardoli, Surat, Gujarat');
  assert.equal(requestedUrls[1].searchParams.get('name'), 'Bardoli');
  assert.equal(result.latitude, 21.12297);
  assert.equal(result.location_source, 'geocoded');
});
