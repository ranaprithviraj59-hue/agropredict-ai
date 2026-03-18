import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, RefreshCw, Languages } from 'lucide-react';

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
    { label: '🌦️ Monsoon farming tips', text: 'Give me tips for farming during monsoon season.' },
  ],
  hi: [
    { label: '🌾 मिट्टी के लिए सबसे अच्छी फसल', text: 'मिट्टी के लिए सबसे अच्छी फसलें कौन सी हैं? हिंदी में बताएं।' },
    { label: '🐛 कीट नियंत्रण', text: 'फसलों को कीड़ों से बचाने के प्राकृतिक तरीके क्या हैं? हिंदी में बताएं।' },
    { label: '💧 पानी बचाने के टिप्स', text: 'खेत में सिंचाई करते समय पानी कैसे बचाएं? हिंदी में बताएं।' },
    { label: '🌱 मिट्टी की सेहत सुधारें', text: 'जैविक तरीके से मिट्टी की सेहत कैसे सुधारें? हिंदी में बताएं।' },
    { label: '💰 लाभदायक फसलें 2025', text: '2025 में कौन सी फसलें सबसे ज्यादा फायदेमंद हैं? हिंदी में बताएं।' },
    { label: '🌦️ मानसून खेती', text: 'मानसून के मौसम में खेती के टिप्स दें। हिंदी में बताएं।' },
  ],
  gu: [
    { label: '🌾 માટી માટે શ્રેષ્ઠ પાક', text: 'ચીકણી માટી માટે શ્રેષ્ઠ પાક કયા છે? ગુજરાતીમાં જવાબ આપો.' },
    { label: '🐛 જંતુ નિયંત્રણ', text: 'કુદરતી રીતે પાકને જીવાતથી કેવી રીતે બચાવવો? ગુજરાતીમાં જવાબ આપો.' },
    { label: '💧 પાણી બચાવવાના સૂચનો', text: 'ખેતરમાં સિંચાઈ કરતી વખતે પાણી કેવી રીતે બચાવવું? ગુજરાતીમાં જવાબ આપો.' },
    { label: '🌱 જમીનની તંદુરસ્તી', text: 'જૈવિક રીતે જમીનની તંદુરસ્તી કેવી રીતે સુધારવી? ગુજરાતીમાં જવાબ આપો.' },
    { label: '💰 નફાકારક પાક 2025', text: '2025 માં સૌથી વધુ નફાકારક પાક કયા છે? ગુજરાતીમાં જવાબ આપો.' },
    { label: '🌦️ ચોમાસુ ખેતી', text: 'ચોમાસાની ઋતુમાં ખેતીની ટીપ્સ આપો. ગુજરાતીમાં જવાბ આપો.' },
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
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: 'easeOut' }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-md"
        >
          <Bot className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-card border border-border rounded-bl-sm'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <ReactMarkdown
              className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert
                [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&>li]:my-0.5 [&>h3]:text-sm [&>h3]:font-bold
                [&>strong]:text-foreground [&>p]:text-foreground [&>li]:text-foreground"
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary/20 border border-border flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex gap-3 justify-start"
    >
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
        <Bot className="w-4 h-4 text-primary-foreground" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ delay: i * 0.18, duration: 0.7, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function ChatBot() {
  const [lang, setLang] = useState('en');
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    initConversation(lang);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const initConversation = async (selectedLang) => {
    const conv = await base44.agents.createConversation({
      agent_name: 'farming_assistant',
      metadata: { name: 'Kisan AI Chat' },
    });
    setConversation(conv);
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGES[selectedLang] }]);

    base44.agents.subscribeToConversation(conv.id, (data) => {
      const msgs = data.messages || [];
      setMessages([
        { role: 'assistant', content: WELCOME_MESSAGES[selectedLang] },
        ...msgs,
      ]);
      setIsTyping(false);
      setIsLoading(false);
    });
  };

  const handleLangChange = async (newLang) => {
    setLang(newLang);
    setMessages([]);
    setConversation(null);
    setInput('');
    await initConversation(newLang);
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || isLoading || !conversation) return;
    // Append language instruction so AI responds in chosen language
    const langInstruction = lang === 'hi'
      ? ' (कृपया हिंदी में जवाब दें)'
      : lang === 'gu'
      ? ' (કૃપા કરીને ગુજરાતીમાં જવાબ આપો)'
      : '';
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    await base44.agents.addMessage(conversation, { role: 'user', content: msg + langInstruction });
  };

  const resetChat = async () => {
    setMessages([]);
    setConversation(null);
    await initConversation(lang);
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between gap-3 flex-wrap"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <Bot className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Kisan AI</h1>
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-xs text-muted-foreground">Your farming assistant is online</span>
              </div>
            </div>
          </div>

          {/* Language selector + reset */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <div className="flex rounded-xl border border-border overflow-hidden bg-card">
              {LANGUAGES.map((l) => (
                <motion.button
                  key={l.code}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLangChange(l.code)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                    lang === l.code
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </motion.button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={resetChat} className="rounded-full h-8 w-8">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </motion.div>

        {/* Quick prompts */}
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-2 flex-wrap mb-4"
        >
          {QUICK_PROMPTS[lang].map((q) => (
            <motion.button
              key={q.label}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendMessage(q.text)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full bg-card border border-border text-foreground hover:border-primary hover:bg-accent transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {q.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Messages */}
        <Card className="flex-1 overflow-y-auto p-4 space-y-4 border-border/50 bg-card/60 backdrop-blur-sm">
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

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder={PLACEHOLDERS[lang]}
            className="flex-1 h-12 rounded-xl border-border/60 bg-card"
            disabled={isLoading}
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 rounded-xl bg-primary shadow-lg shadow-primary/30"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}