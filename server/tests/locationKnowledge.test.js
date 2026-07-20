import test from 'node:test';
import assert from 'node:assert/strict';
import { getLocationSuggestion, inferLocationFromCoordinates, locationKnowledge } from '../data/locationKnowledge.js';

test('location knowledge includes Indian states and suggests Surat farm profile', () => {
  assert.ok(locationKnowledge.states.length >= 36);
  assert.equal(locationKnowledge.stateProfiles.Gujarat.districts.length, 34);
  assert.ok(locationKnowledge.stateProfiles.Gujarat.districts.includes('Vav-Tharad'));

  const suggestion = getLocationSuggestion({
    state: 'Gujarat',
    district: 'Surat',
  });

  assert.equal(suggestion.region, 'west_coastal');
  assert.equal(suggestion.climate_zone, 'tropical');
  assert.ok(suggestion.soil_types.includes('alluvial'));
  assert.ok(suggestion.water_sources.includes('canal'));
});

test('location knowledge falls back from unknown village to state profile', () => {
  const suggestion = getLocationSuggestion({
    state: 'Rajasthan',
    district: 'Small Village',
  });

  assert.equal(suggestion.region, 'arid_west');
  assert.equal(suggestion.climate_zone, 'arid');
  assert.ok(suggestion.soil_types.includes('sandy'));
  assert.equal(suggestion.water_availability, 'scarce');
});

test('location knowledge infers Gujarat district from coordinates', () => {
  const suggestion = inferLocationFromCoordinates({
    latitude: 21.1702,
    longitude: 72.8311,
  });

  assert.equal(suggestion.state, 'Gujarat');
  assert.equal(suggestion.district, 'Surat');
  assert.equal(suggestion.region, 'west_coastal');
  assert.ok(suggestion.soil_types.includes('alluvial'));
});
