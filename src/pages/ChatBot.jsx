import { useState, useEffect, useRef } from 'react';
import { agroApi } from '@/api/agroApi';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Loader2, RefreshCw, Languages, Sparkles } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🌾' },
];

const QUICK_PROMPTS = {
  en: [
    { label: '🌾 Best crops for clay soil', text: 'What are the best crops to grow in clay soil?' },
    { label: '🐛 Pest control tips', text: 'How do I protect my crops from pests naturally?' },
    { label: '💧 Save water tips', text: 'How can I save water while irrigating my farm?' },
    { label: '🌱 Improve soil health', text: 'How can I improve my soil health organically?' },
    { label: '💰 Profitable crops 2025', text: 'Which crops are most profitable to grow in 2025?' },
  ],
  hi: [
    { label: '🌾 मिट्टी के लिए सबसे अच्छी फसल', text: 'मिट्टी के लिए सबसे अच्छी फसलें कौन सी हैं? हिंदी में बताएं।' },
    { label: '🐛 कीट नियंत्रण', text: 'फसलों को कीड़ों से बचाने के प्राकृतिक तरीके क्या हैं? हिंदी में बताएं।' },
    { label: '💧 पानी बचाने के टिप्स', text: 'खेत में सिंचाई करते समय पानी कैसे बचाएं? हिंदी में बताएं।' },
    { label: '🌱 मिट्टी की सेहत सुधारें', text: 'जैविक तरीके से मिट्टी की सेहत कैसे सुधारें? हिंदी में बताएं।' },
  ],
  gu: [
    { label: '🌾 માટી માટે શ્રેષ્ઠ પાક', text: 'ચીકણી માટી માટે શ્રેષ્ઠ પાક કયા છે? ગુજરાતીમાં જવાબ આપો.' },
    { label: '🐛 જંતુ નિયંત્રણ', text: 'કુદરતી રીતે પાકને જીવાતથી કેવી રીતે બચાવવો? ગુજરાતીમાં જવાબ આપો.' },
    { label: '💧 પાણી બચાવવાના સૂચનો', text: 'ખેતરમાં સિંચાઈ કરતી વખતે પાણી કેવી રીતે બચાવવું? ગુજરાતીમાં જવાબ આપો.' },
  ],
};

const WELCOME_MESSAGES = {
  en: "🌾 **Namaste! I'm Kisan AI** — your personal farming assistant!\n\nI can help you with:\n- 🌱 Crop selection & planning\n- 🐛 Pest & disease control\n- 💧 Irrigation & water management\n- 🌿 Soil health improvement\n- 💰 Crop pricing & market trends\n- 🌦️ Season-specific farming tips\n\nWhat farming challenge can I help you with today?",
  hi: "🌾 **नमस्ते! मैं किसान AI हूँ** — आपका व्यक्तिगत खेती सहायक!\n\nमैं इन विषयों में आपकी मदद कर सकता हूँ:\n- 🌱 फसल चयन और योजना\n- 🐛 कीट और रोग नियंत्रण\n- 💧 सिंचाई और जल प्रबंधन\n- 🌿 मिट्टी स्वास्थ्य सुधार\n- 💰 फसल मूल्य और बाजार रुझान\n- 🌦️ मौसम के अनुसार खेती के टिप्स\n\nआज मैं आपकी किस खेती समस्या में मदद कर सकता हूँ?",
  gu: "🌾 **નમસ્તે! હું કિસાન AI છું** — તમારો વ્યક્તિગત ખેતી સહાયક!\n\nહું આ વિષયોમાં મદદ કરી શકું છું:\n- 🌱 પાક પસંદગી અને આયોજન\n- 🐛 જંતુ અને રોગ નિયંત્રણ\n- 💧 સિંચાઈ અને જળ વ્યવસ્થાપન\n- 🌿 જમીન સ્વાસ્થ્ય સુધારો\n- 💰 પાક ભાવ અને બજાર વલણ\n- 🌦️ ઋતુ આધારિત ખેતી ટીપ્સ\n\nઆજે હું તમારી કઈ ખેતી સમસ્યામાં મદદ કરી શકું?",
};

const PLACEHOLDERS = {
  en: 'Ask about crops, soil, pests, weather...',
  hi: 'फसल, मिट्टी, कीट, मौसम के बारे में पूछें...',
  gu: 'પાક, માટી, જંતુ, હવામાન વિશે પૂછો...',
};

function MessageBubble({ message, index }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-md text-white border border-emerald-400/30">
          <Bot className="w-5 h-5" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 shadow-lg ${
          isUser
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium'
            : 'bg-slate-900/95 border border-slate-700 text-slate-100'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <ReactMarkdown
              className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert
                [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&>li]:my-0.5 [&>h3]:text-sm [&>h3]:font-bold
                [&>strong]:text-amber-300 [&>p]:text-slate-100 [&>li]:text-slate-200"
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
        <Bot className="w-5 h-5" />
      </div>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ delay: i * 0.15, duration: 0.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-emerald-400"
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lang, setLang] = useState('en');
  const bottomRef = useRef(null);

  const initConversation = async (language = 'en') => {
    try {
      const convs = await agroApi.chat.conversations();
      if (convs && convs.length > 0) {
        const latest = convs[0];
        const history = await agroApi.chat.history(latest.id);
        if (history && history.length > 0) {
          setMessages(history);
          return;
        }
      }
    } catch {
      // fallback to welcome message
    }

    setMessages([{ role: 'assistant', content: WELCOME_MESSAGES[language] }]);
  };

  useEffect(() => {
    initConversation(lang);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    if (messages.length <= 1) {
      setMessages([{ role: 'assistant', content: WELCOME_MESSAGES[newLang] }]);
    }
  };

  const sendMessage = async (overrideText) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await agroApi.chat.sendMessage({
        message: textToSend,
        language: lang,
      });

      setIsTyping(false);
      const assistantMsg = {
        role: 'assistant',
        content: response.answer || response.response || response.message || 'I am ready to help you with your farm!',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered a connection issue. Please try again!' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    setMessages([]);
    await initConversation(lang);
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-17rem)] sm:h-[calc(100vh-18rem)] min-h-[480px] pt-6 sm:pt-8">
        
        {/* Header with clear offset below navbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between gap-3 flex-wrap"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg text-white border border-emerald-400/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-extrabold text-white">Kisan AI Assistant</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-300">Ask any crop, soil, weather or market pricing question</p>
            </div>
          </div>

          {/* Language Selector + Reset Button */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-emerald-400" />
            <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-900">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLangChange(l.code)}
                  className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1 ${
                    lang === l.code
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={resetChat} className="rounded-xl h-9 w-9 text-slate-300 hover:bg-slate-800 hover:text-white">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Quick Prompts */}
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 flex-wrap mb-3"
        >
          {QUICK_PROMPTS[lang]?.map((q) => (
            <button
              key={q.label}
              onClick={() => sendMessage(q.text)}
              disabled={isLoading}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </motion.div>

        {/* Chat History Box */}
        <Card className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">
            {messages.map((msg, i) => (
              <MessageBubble key={`${lang}-${i}`} message={msg} index={i} />
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={bottomRef} />
        </Card>

        {/* Input Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder={PLACEHOLDERS[lang]}
            className="flex-1 h-13 rounded-2xl border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-400 focus:border-emerald-400 font-medium text-sm shadow-xl"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="h-13 w-13 btn-luxury rounded-2xl shadow-xl flex-shrink-0"
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
