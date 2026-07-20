import { buildKisanSystemPrompt, getLanguageInstruction } from './kisanPrompt.js';

const getDefaultHfModel = () => process.env.HUGGINGFACE_MODEL || 'openai/gpt-oss-120b:fastest';

export async function fetchHuggingFaceAIResponse({
  message,
  language = 'en',
  history = [],
  apiKey = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '',
  model = getDefaultHfModel(),
  fetchImpl = fetch,
} = {}) {
  const token = String(apiKey || '').trim();
  if (!token) return null;

  try {
    const response = await fetchImpl('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildKisanSystemPrompt(language) },
          { role: 'system', content: getLanguageInstruction(language) },
          ...history.slice(-8),
          { role: 'user', content: message },
        ],
        max_tokens: 900,
        temperature: 0.45,
        stream: false,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) return null;

    return {
      answer,
      provider: 'huggingface',
      model: data.model || model,
    };
  } catch (error) {
    console.warn(`Hugging Face Kisan AI unavailable: ${error.message}`);
    return null;
  }
}
