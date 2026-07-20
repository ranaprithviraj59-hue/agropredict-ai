const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export async function fetchOpenRouterAIResponse(message, language = 'en') {
  const langInstruction = 
    language === 'hi' ? 'Please provide your full answer in Hindi (हिंदी).' :
    language === 'gu' ? 'Please provide your full answer in Gujarati (ગુજરાતી).' :
    'Please provide your answer in clear, friendly English.';

  const systemPrompt = `You are Kisan AI (किसान AI / કિસાન AI), an advanced AI farming assistant specializing in Indian agriculture, crop recommendations, soil health (NPK, pH), irrigation, pest control, weather impact, and mandi pricing. Answer practical farming queries accurately, concisely, and supportively. ${langInstruction}`;

  const modelsToTry = [
    'deepseek/deepseek-chat',
    'google/gemini-2.0-flash-lite-001',
    'meta-llama/llama-3.3-70b-instruct',
    'mistralai/mistral-7b-instruct'
  ];

  for (const model of modelsToTry) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'CropAI Kisan Assistant',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim().length > 0) {
          return content.trim();
        }
      }
    } catch (err) {
      console.warn(`OpenRouter model ${model} error:`, err.message);
    }
  }

  return null;
}
