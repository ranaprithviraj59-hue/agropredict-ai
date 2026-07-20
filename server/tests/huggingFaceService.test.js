import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchHuggingFaceAIResponse } from '../services/huggingFaceService.js';

test('fetchHuggingFaceAIResponse calls Hugging Face chat completions with agriculture system prompt', async () => {
  let request;
  const result = await fetchHuggingFaceAIResponse({
    message: 'Which crop should I grow in alluvial soil?',
    language: 'en',
    apiKey: 'hf_test',
    fetchImpl: async (url, options) => {
      request = { url: String(url), body: JSON.parse(options.body), headers: options.headers };
      return {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Rice and wheat are good options with enough water.' } }],
          model: 'openai/gpt-oss-120b:fastest',
        }),
      };
    },
  });

  assert.equal(request.url, 'https://router.huggingface.co/v1/chat/completions');
  assert.equal(request.headers.Authorization, 'Bearer hf_test');
  assert.equal(request.body.model, 'openai/gpt-oss-120b:fastest');
  assert.ok(request.body.messages[0].content.includes('Indian agriculture'));
  assert.equal(result.answer, 'Rice and wheat are good options with enough water.');
  assert.equal(result.provider, 'huggingface');
  assert.equal(result.model, 'openai/gpt-oss-120b:fastest');
});

test('fetchHuggingFaceAIResponse returns null when no token is configured', async () => {
  const result = await fetchHuggingFaceAIResponse({
    message: 'Help me',
    apiKey: '',
    fetchImpl: async () => {
      throw new Error('should not call network');
    },
  });

  assert.equal(result, null);
});
