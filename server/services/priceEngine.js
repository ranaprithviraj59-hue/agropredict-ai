const priceBase = {
  rice: 2300,
  wheat: 2450,
  'corn/maize': 2200,
  maize: 2200,
  cotton: 6900,
  sugarcane: 360,
  soybean: 4800,
  tomato: 1800,
  onion: 1600,
  potato: 1400,
  chickpea: 5600,
  lentil: 6500,
  mustard: 5450,
  groundnut: 6200,
  sunflower: 5200,
  turmeric: 9200,
  chilli: 10500,
  mango: 4200,
  banana: 1600,
  garlic: 7800,
  ginger: 6200,
};

const marketMultiplier = {
  'Local Mandi': 0.96,
  'State Market': 1,
  'National Market': 1.06,
  Export: 1.16,
};

const seasonTrend = {
  Kharif: 0.04,
  Rabi: 0.035,
  Zaid: 0.025,
  'Year Round': 0.015,
};

const monthNames = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

export function predictPrice({ crop, market, season, quantity, liveMarket }) {
  const cropKey = String(crop || '').toLowerCase();
  const base = priceBase[cropKey] || 3000;
  const marketFactor = marketMultiplier[market] || 1;
  const trend = seasonTrend[season] || 0.02;
  const liveModal = Number(liveMarket?.modal_price);
  const hasLiveMarket = Number.isFinite(liveModal) && liveModal > 0;
  const current = hasLiveMarket ? Math.round(liveModal) : Math.round(base * marketFactor);
  const oneMonth = Math.round(current * (1 + trend));
  const threeMonths = Math.round(current * (1 + trend * 2.4));
  const sixMonths = Math.round(current * (1 + trend * 4.2));
  const qty = Number(quantity);
  const trendType = trend > 0.03 ? 'up' : trend < 0 ? 'down' : 'stable';
  const minPrice = hasLiveMarket && Number(liveMarket.min_price) > 0
    ? Math.round(Number(liveMarket.min_price))
    : Math.round(current * 0.88);
  const maxPrice = hasLiveMarket && Number(liveMarket.max_price) > 0
    ? Math.round(Number(liveMarket.max_price))
    : Math.round(current * 1.18);
  const monthlyForecast = monthNames.map((month, index) => ({
    month,
    price: Math.round(current * (1 + trend * (index + 1) * 0.8)),
  }));
  const totalRevenue = Number.isFinite(qty) && qty > 0 ? current * qty : null;
  const dataSource = hasLiveMarket
    ? {
        type: 'live_mandi',
        label: 'Live mandi price from data.gov.in',
        market: liveMarket.market,
        state: liveMarket.state,
        district: liveMarket.district,
        date: liveMarket.arrival_date,
        source_url: liveMarket.source_url,
      }
    : {
        type: 'local_estimate',
        label: 'Local fallback estimate',
        note: 'Live mandi lookup returned no matching record or the API was unavailable. A personal DATA_GOV_API_KEY can improve limits.',
      };

  return {
    crop,
    market,
    season,
    current_price: current,
    price_1_month: oneMonth,
    price_3_months: threeMonths,
    price_6_months: sixMonths,
    trend: trendType,
    trend_percent: Number((trend * 100).toFixed(1)),
    min_price: minPrice,
    max_price: maxPrice,
    is_live: hasLiveMarket,
    data_source: dataSource,
    market_factors: [
      hasLiveMarket
        ? `Live mandi modal price from ${liveMarket.market || liveMarket.district || 'selected market'} is used as the current price.`
        : 'Live mandi lookup did not return a usable matching record, so the system is using a local fallback estimate.',
      `${market || 'Selected market'} demand and mandi arrivals affect short-term price.`,
      `${season || 'Season'} harvest timing changes supply pressure.`,
      'Storage quality, transport cost, and rainfall can shift final selling price.',
      'Government MSP/procurement policies may support prices for major crops.',
    ],
    best_sell_time: trendType === 'up' ? 'Hold for 1-3 months if storage is available.' : 'Sell in nearby market after comparing current mandi rates.',
    monthly_forecast: monthlyForecast,
    total_revenue: totalRevenue,
    predicted_price_per_quintal: current,
    monthly_trend: monthlyForecast,
    total_estimated_revenue: totalRevenue,
    quantity_quintals: Number.isFinite(qty) && qty > 0 ? qty : null,
  };
}
