import { buildKisanSystemPrompt, getLanguageInstruction } from './kisanPrompt.js';

export async function fetchOpenRouterAIResponse({
  message,
  language = 'en',
  history = [],
  apiKey = process.env.OPENROUTER_API_KEY || '',
  preferredModel = process.env.OPENROUTER_MODEL || 'openrouter/auto',
  fetchImpl = fetch,
} = {}) {
  const token = String(apiKey || '').trim();
  if (!token) return null;

  const modelsToTry = [
    preferredModel,
    'openrouter/auto',
    'google/gemini-2.0-flash-001',
    'deepseek/deepseek-chat-v3-0324',
    'google/gemini-2.0-flash-lite-001',
    'meta-llama/llama-3.3-70b-instruct'
  ].filter((model, index, models) => model && models.indexOf(model) === index);

  for (const model of modelsToTry) {
    try {
      const response = await fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'CropAI Kisan Assistant',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: buildKisanSystemPrompt(language) },
            { role: 'system', content: getLanguageInstruction(language) },
            ...history.slice(-8),
            { role: 'user', content: message }
          ],
          temperature: 0.45,
          max_tokens: 1100,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim().length > 0) {
          return {
            answer: content.trim(),
            provider: 'openrouter',
            model: data.model || model,
          };
        }
      }
    } catch (err) {
      console.warn(`OpenRouter model ${model} error:`, err.message);
    }
  }

  return null;
}
