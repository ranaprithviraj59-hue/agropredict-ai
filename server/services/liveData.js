const MANDI_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const DATA_GOV_BASE_URL = `https://api.data.gov.in/resource/${MANDI_RESOURCE_ID}`;
export const DATA_GOV_SAMPLE_API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

const toNumber = (value) => {
  const number = Number(String(value ?? '').replace(/,/g, '').trim());
  return Number.isFinite(number) ? number : null;
};

const toCoordinate = (value) => {
  if (value === null || value === undefined || value === '') return null;
  return toNumber(value);
};

const asText = (value) => String(value || '').trim();

const buildLocationName = (farm) => [
  farm?.city,
  farm?.district,
  farm?.state,
].map(asText).filter(Boolean).join(', ');

async function geocodeFarmLocation(farm, fetchImpl) {
  const candidates = [
    buildLocationName(farm),
    farm?.city,
    farm?.district,
    farm?.location,
    farm?.state,
  ].map(asText).filter(Boolean);
  const uniqueCandidates = [...new Set(candidates)];
  if (!uniqueCandidates.length) return null;

  for (const name of uniqueCandidates) {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', name);
    url.searchParams.set('count', '1');
    url.searchParams.set('language', 'en');
    url.searchParams.set('format', 'json');
    url.searchParams.set('countryCode', 'IN');

    const response = await fetchImpl(url);
    if (!response.ok) throw new Error(`Geocoding API failed with ${response.status}`);
    const body = await response.json();
    const match = Array.isArray(body.results) ? body.results[0] : null;
    if (!match) continue;

    return {
      latitude: toNumber(match.latitude),
      longitude: toNumber(match.longitude),
      name: [match.name, match.admin2, match.admin1].map(asText).filter(Boolean).join(', '),
    };
  }

  return null;
}

export async function getWeatherForFarm(farm, { fetchImpl = fetch } = {}) {
  let latitude = toCoordinate(farm?.latitude);
  let longitude = toCoordinate(farm?.longitude);
  let locationSource = 'coordinates';
  let locationName = buildLocationName(farm) || asText(farm?.location);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    const geocoded = await geocodeFarmLocation(farm, fetchImpl);
    if (!geocoded?.latitude || !geocoded?.longitude) return null;
    latitude = geocoded.latitude;
    longitude = geocoded.longitude;
    locationSource = 'geocoded';
    locationName = geocoded.name || locationName;
  }

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m');
  url.searchParams.set('daily', 'precipitation_sum,temperature_2m_max,temperature_2m_min');
  url.searchParams.set('forecast_days', '1');
  url.searchParams.set('timezone', 'auto');

  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`Weather API failed with ${response.status}`);
  const body = await response.json();

  return {
    source: 'Open-Meteo',
    source_url: url.toString(),
    fetched_at: new Date().toISOString(),
    location_source: locationSource,
    location_name: locationName,
    latitude,
    longitude,
    temperature_c: toNumber(body.current?.temperature_2m),
    humidity_percent: toNumber(body.current?.relative_humidity_2m),
    precipitation_mm: toNumber(body.current?.precipitation ?? body.daily?.precipitation_sum?.[0]),
    wind_speed_kmh: toNumber(body.current?.wind_speed_10m),
    daily_max_c: toNumber(body.daily?.temperature_2m_max?.[0]),
    daily_min_c: toNumber(body.daily?.temperature_2m_min?.[0]),
  };
}

const buildMandiUrl = ({ crop, state, district, market, apiKey }) => {
  const url = new URL(DATA_GOV_BASE_URL);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '10');
  if (crop) url.searchParams.set('filters[commodity]', crop);
  if (state) url.searchParams.set('filters[state]', state);
  if (district) url.searchParams.set('filters[district]', district);
  if (market && !['Local Mandi', 'State Market', 'National Market', 'Export'].includes(market)) {
    url.searchParams.set('filters[market]', market);
  }
  return url;
};

const fetchMandiRecords = async (url, fetchImpl) => {
  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`Mandi API failed with ${response.status}`);
  const body = await response.json();
  return Array.isArray(body.records) ? body.records : [];
};

const normalizeMandiRecord = (record, sourceUrl, matchLevel) => ({
  state: asText(record.state || record.State),
  district: asText(record.district || record.District),
  market: asText(record.market || record.Market),
  commodity: asText(record.commodity || record.Commodity),
  variety: asText(record.variety || record.Variety),
  grade: asText(record.grade || record.Grade),
  arrival_date: asText(record.arrival_date || record.Arrival_Date),
  min_price: toNumber(record.min_price || record.Min_Price),
  max_price: toNumber(record.max_price || record.Max_Price),
  modal_price: toNumber(record.modal_price || record.Modal_Price),
  source_url: sourceUrl,
  match_level: matchLevel,
});

export async function getLiveMandiPrice({ crop, state, district, market }, {
  apiKey = process.env.DATA_GOV_API_KEY || DATA_GOV_SAMPLE_API_KEY,
  fetchImpl = fetch,
} = {}) {
  const resolvedApiKey = apiKey || DATA_GOV_SAMPLE_API_KEY;
  const attempts = [
    { crop, state, district, market, matchLevel: 'district' },
    { crop, state, market, matchLevel: 'state' },
    { crop, market, matchLevel: 'commodity' },
  ];

  for (const attempt of attempts) {
    const url = buildMandiUrl({ ...attempt, apiKey: resolvedApiKey });
    let records = [];
    try {
      records = await fetchMandiRecords(url, fetchImpl);
    } catch (error) {
      console.warn(`Live mandi lookup unavailable: ${error.message}`);
      return null;
    }
    const usable = records
      .map((record) => normalizeMandiRecord(record, url.toString(), attempt.matchLevel))
      .filter((record) => record.modal_price);

    if (usable[0]) return usable[0];
  }

  return null;
}
