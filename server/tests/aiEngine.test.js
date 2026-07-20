import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDynamicKisanAnswer } from '../services/aiEngine.js';

test('generateDynamicKisanAnswer prioritizes crop recommendation questions over generic water advice', () => {
  const answer = generateDynamicKisanAnswer('Which crop should I grow in alluvial soil with canal water?', 'en');

  assert.ok(answer.toLowerCase().includes('crop'));
  assert.ok(answer.toLowerCase().includes('rice') || answer.toLowerCase().includes('wheat'));
  assert.ok(answer.includes('Predict Crops'));
});
