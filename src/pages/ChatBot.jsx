import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Sparkles, RefreshCw } from 'lucide-react';

const QUICK_PROMPTS = [
  { label: '🌾 Best crops for clay soil', text: 'What are the best crops to grow in clay soil?' },
  { label: '🐛 Pest control tips', text: 'How do I protect my crops from pests naturally?' },
  { label: '💧 Save water tips', text: 'How can I save water while irrigating my farm?' },
  { label: '🌱 Improve soil health', text: 'How can I improve my soil health organically?' },
  { label: '💰 Profitable crops 2025', text: 'Which crops are most profitable to grow in 2025?' },
  { label: '🌦️ Monsoon farming tips', text: 'Give me tips for farming during monsoon season.' },
];

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
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const initConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'farming_assistant',
      metadata: { name: 'Kisan AI Chat' },
    });
    setConversation(conv);
    setMessages([{
      role: 'assistant',
      content: "🌾 **Namaste! I'm Kisan AI** — your personal farming assistant!\n\nI can help you with:\n- 🌱 Crop selection & planning\n- 🐛 Pest & disease control\n- 💧 Irrigation & water management\n- 🌿 Soil health improvement\n- 💰 Crop pricing & market trends\n- 🌦️ Season-specific farming tips\n\nWhat farming challenge can I help you with today?",
    }]);

    base44.agents.subscribeToConversation(conv.id, (data) => {
      const msgs = data.messages || [];
      setMessages([
        {
          role: 'assistant',
          content: "🌾 **Namaste! I'm Kisan AI** — your personal farming assistant!\n\nI can help you with:\n- 🌱 Crop selection & planning\n- 🐛 Pest & disease control\n- 💧 Irrigation & water management\n- 🌿 Soil health improvement\n- 💰 Crop pricing & market trends\n- 🌦️ Season-specific farming tips\n\nWhat farming challenge can I help you with today?",
        },
        ...msgs,
      ]);
      setIsTyping(false);
      setIsLoading(false);
    });
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || isLoading || !conversation) return;
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    await base44.agents.addMessage(conversation, { role: 'user', content: msg });
  };

  const resetChat = async () => {
    setMessages([]);
    setConversation(null);
    await initConversation();
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between"
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
          <Button variant="ghost" size="icon" onClick={resetChat} className="rounded-full">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Quick prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap mb-4"
        >
          {QUICK_PROMPTS.map((q) => (
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
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} index={i} />
          ))}
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
            placeholder="Ask about crops, soil, pests, weather..."
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