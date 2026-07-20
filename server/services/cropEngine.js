const normalize = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, '_');

const regionFromLocation = (location = '') => {
  const text = location.toLowerCase();
  if (text.includes('kutch') || text.includes('rajasthan')) return 'dry';
  if (text.includes('surat') || text.includes('kerala') || text.includes('coastal')) return 'humid';
  if (text.includes('gujarat') || text.includes('maharashtra')) return 'west_india';
  if (text.includes('punjab') || text.includes('haryana')) return 'north_india';
  return 'general';
};

const phScore = (actual, [min, max]) => {
  const ph = Number(actual);
  if (!Number.isFinite(ph)) return 8;
  if (ph >= min && ph <= max) return 15;
  const distance = ph < min ? min - ph : ph - max;
  return Math.max(0, 15 - distance * 6);
};

const waterScore = (farmWater, cropWater) => {
  const water = normalize(farmWater);
  if (cropWater.includes(water)) return 18;
  if (water === 'abundant' && cropWater.includes('moderate')) return 13;
  if (water === 'moderate' && cropWater.includes('scarce')) return 12;
  if (water === 'scarce' && cropWater.includes('abundant')) return 1;
  return 6;
};

const seasonScore = (season, cropSeasons) => {
  const value = normalize(season);
  if (cropSeasons.includes(value)) return 18;
  if (cropSeasons.includes('year_round')) return 12;
  return 2;
};

export function predictCrops(farm, season, cropKnowledge) {
  const soil = normalize(farm.soil_type);
  const climate = normalize(farm.climate_zone);
  const irrigation = normalize(farm.irrigation_type || farm.water_source);
  const previousCrop = normalize(farm.previous_crop);
  const region = normalize(farm.region) || regionFromLocation(farm.location);

  const predictions = cropKnowledge.map((crop) => {
    const breakdown = {
      soil: crop.soils.includes(soil) ? 20 : 4,
      water: waterScore(farm.water_availability, crop.water),
      season: seasonScore(season, crop.seasons),
      climate: crop.climates.includes(climate) ? 14 : 6,
      ph: phScore(farm.soil_ph, crop.ph),
      irrigation: crop.irrigation.includes(irrigation) ? 8 : 3,
      rotation: previousCrop && normalize(crop.crop_name) !== previousCrop ? 5 : 1,
      region: (region.includes('arid') || region === 'dry') && crop.water.includes('scarce')
        ? 4
        : (region.includes('coastal') || region === 'humid') && crop.water.includes('abundant')
          ? 4
          : 2,
    };

    const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
    const probability = Math.min(96, Math.max(18, Math.round(total)));
    const reasons = [];
    const risks = [];

    if (breakdown.soil >= 20) reasons.push(`${crop.crop_name} is suitable for ${soil.replace(/_/g, ' ')} soil.`);
    else risks.push(`Soil match is weak for ${crop.crop_name}; improve soil structure before sowing.`);

    if (breakdown.water >= 18) reasons.push(`Water availability matches the crop requirement.`);
    else if (breakdown.water <= 3) risks.push(`${crop.crop_name} needs more water than this farm profile provides.`);

    if (breakdown.season >= 18) reasons.push(`The selected season is ideal for this crop.`);
    else risks.push(`Season match is not ideal; use local sowing calendar before planting.`);

    if (breakdown.ph >= 14) reasons.push(`Soil pH is within the preferred range ${crop.ph[0]}-${crop.ph[1]}.`);
    else risks.push(`Adjust soil pH toward ${crop.ph[0]}-${crop.ph[1]} for better nutrient uptake.`);

    return {
      crop_name: crop.crop_name,
      success_probability: probability,
      score_breakdown: breakdown,
      expected_yield: crop.yield,
      growth_duration_days: crop.duration,
      water_requirement: crop.water.join('/'),
      investment_level: crop.investment,
      market_demand: crop.demand,
      fertilizer_advice: crop.fertilizer,
      irrigation_advice: crop.irrigationAdvice,
      tips: `${crop.fertilizer} ${crop.irrigationAdvice}`,
      reasons,
      risks: risks.length ? risks : [crop.risk],
    };
  }).sort((a, b) => b.success_probability - a.success_probability);

  const top = predictions[0];
  return {
    predictions,
    recommendation_notes: `${top.crop_name} is the best current match with ${top.success_probability}% suitability. The score considers soil, season, water, pH, climate, irrigation, rotation, and region.`,
  };
}
