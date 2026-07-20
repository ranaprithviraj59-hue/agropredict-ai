import { generateDynamicKisanAnswer } from './aiEngine.js';
import { fetchHuggingFaceAIResponse } from './huggingFaceService.js';
import { fetchOpenRouterAIResponse } from './openrouterService.js';

export async function generateKisanAiResponse({ message, language = 'en', history = [] } = {}) {
  const openRouter = await fetchOpenRouterAIResponse({ message, language, history });
  if (openRouter) return openRouter;

  const huggingFace = await fetchHuggingFaceAIResponse({ message, language, history });
  if (huggingFace) return huggingFace;

  return {
    answer: generateDynamicKisanAnswer(message, language),
    provider: 'local_knowledge',
    model: 'rule-based-kisan-engine',
  };
}
