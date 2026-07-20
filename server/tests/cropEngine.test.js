import test from 'node:test';
import assert from 'node:assert/strict';
import { cropKnowledge } from '../data/cropKnowledge.js';
import { predictCrops } from '../services/cropEngine.js';

test('predictCrops ranks rice highly for alluvial kharif farms with abundant water', () => {
  const result = predictCrops({
    location: 'Surat, Gujarat',
    soil_type: 'alluvial',
    water_availability: 'abundant',
    climate_zone: 'tropical',
    irrigation_type: 'flood',
    soil_ph: 6.5,
    previous_crop: 'Wheat',
    farm_size_acres: 5,
  }, 'kharif', cropKnowledge);

  assert.ok(result.predictions.length >= 5);
  assert.equal(result.predictions[0].crop_name, 'Rice');
  assert.ok(result.predictions[0].success_probability >= 80);
  assert.ok(result.predictions[0].score_breakdown.soil > 0);
  assert.ok(result.predictions[0].reasons.some((reason) => reason.includes('soil')));
  assert.ok(result.recommendation_notes.includes('Rice'));
});

test('predictCrops penalizes high-water crops when water is scarce', () => {
  const result = predictCrops({
    location: 'Kutch, Gujarat',
    soil_type: 'sandy',
    water_availability: 'scarce',
    climate_zone: 'arid',
    irrigation_type: 'drip',
    soil_ph: 7.3,
    previous_crop: 'Cotton',
    farm_size_acres: 3,
  }, 'rabi', cropKnowledge);

  const rice = result.predictions.find((crop) => crop.crop_name === 'Rice');
  const chickpea = result.predictions.find((crop) => crop.crop_name === 'Chickpea');

  assert.ok(chickpea);
  assert.ok(!rice || chickpea.success_probability > rice.success_probability);
  assert.ok(result.predictions[0].risks.length > 0);
});
