import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, MinusCircle, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { askGemini, getModelInfo } from '../utils/gemini';
import { trackEvent } from '../utils/analytics';
import { notifyChatMessage } from '../utils/chatNotify';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  '주요 프로젝트가 뭐가 있나요?',
  '어떤 기술 스택을 사용하나요?',
  '이 사이트의 인터랙티브 기능들은?',
  '연락은 어떻게 하면 되나요?',
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 저는 최원혁의 포트폴리오 AI 어시스턴트입니다.\n\n프로젝트, 경력, 기술 스택 등 궁금한 점을 자유롭게 물어보세요 🚀',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const notifiedRef = useRef(false);
  const modelInfo = getModelInfo();

  // Auto-scroll
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Show welcome bubble after 6s (once)
  useEffect(() => {
    if (bubbleDismissed || isOpen) return;
    const timer = setTimeout(() => setShowBubble(true), 6000);
    return () => clearTimeout(timer);
  }, [bubbleDismissed, isOpen]);

  // Re-show bubble periodically if not dismissed and not opened
  useEffect(() => {
    if (bubbleDismissed || isOpen) return;
    const interval = setInterval(() => {
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 8000);
    }, 45000);
    return () => clearInterval(interval);
  }, [bubbleDismissed, isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setShowBubble(false);
    trackEvent('chatbot', 'open');
    const count = parseInt(localStorage.getItem('portfolio_chat_count') || '0');
    localStorage.setItem('portfolio_chat_count', (count + 1).toString());
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    trackEvent('chatbot', 'close');
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    trackEvent('chatbot', 'minimize');
  };

  const handleSend = async (text?: string) => {
    const userText = (text || inputValue).trim();
    if (!userText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setHasUserSentMessage(true);
    trackEvent('chatbot', 'send_message');

    // Send email notification on first message
    if (!notifiedRef.current) {
      notifiedRef.current = true;
      notifyChatMessage(userText, window.location.pathname);
    }

    try {
      const history = messages
        .filter((m) => m.id !== '1')
        .slice(-10)
        .map((m) => ({
          role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
          text: m.text,
        }));

      const response = await askGemini(userText, history);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: '죄송합니다, 응답 중 오류가 발생했습니다. 다시 시도해 주세요.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  // ─── Floating Button + Welcome Bubble ───
  if (!isOpen) {
    return (
      <>
        {/* Welcome Bubble */}
        <AnimatePresence>
          {showBubble && !bubbleDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="fixed bottom-24 right-6 z-50 max-w-[280px]"
            >
              <div className="bg-slate-800 border border-slate-600 rounded-2xl rounded-br-sm p-4 shadow-2xl relative">
                <button
                  onClick={() => {
                    setShowBubble(false);
                    setBubbleDismissed(true);
                  }}
                  className="absolute top-2 right-2 text-slate-500 hover:text-white"
                >
                  <X size={14} />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-indigo-400" />
                  <span className="text-indigo-400 text-xs font-bold">AI Assistant</span>
                </div>
                <p className="text-white text-sm leading-relaxed mb-3">
                  궁금한 점이 있으신가요? 프로젝트, 경력, 기술 스택에 대해 AI에게 물어보세요!
                </p>
                <button
                  onClick={handleOpen}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  대화 시작하기 <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          onClick={handleOpen}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50 group"
        >
          <div className="relative">
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20" />
            <div className="relative p-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-110 flex items-center justify-center">
              <MessageCircle size={26} />
            </div>
            {/* Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <Sparkles size={10} className="text-white" />
            </span>
          </div>
        </motion.button>
      </>
    );
  }

  // ─── Minimized ───
  if (isMinimized) {
    return (
      <motion.button
        onClick={() => setIsMinimized(false)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105 z-50 flex items-center gap-2 font-medium"
      >
        <Sparkles size={18} />
        <span className="text-sm">AI Chat</span>
      </motion.button>
    );
  }

  // ─── Chat Panel ───
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-6 right-6 w-[340px] sm:w-[400px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Portfolio AI Assistant</h3>
            <p className="text-slate-400 text-[10px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {modelInfo.display} · {modelInfo.provider}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={handleMinimize}
            className="p-1.5 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <MinusCircle size={18} />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Model Banner */}
      <div className="bg-indigo-950/40 border-b border-indigo-500/10 px-4 py-2 flex items-center gap-2">
        <Sparkles size={11} className="text-indigo-400 flex-shrink-0" />
        <p className="text-indigo-300/70 text-[10px] leading-tight">
          <span className="font-semibold text-indigo-300">{modelInfo.display}</span> 기반 — 포트폴리오
          전체를 학습한 AI가 실시간 답변합니다
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto h-72 flex flex-col gap-3 bg-slate-900/50 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm p-3 flex items-center gap-2">
              <Loader2 size={14} className="text-indigo-400 animate-spin" />
              <span className="text-slate-400 text-sm">생각 중...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (show only before first user message) */}
      {!hasUserSentMessage && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 border-t border-slate-800 pt-2 bg-slate-900/80">
          <span className="text-[10px] text-slate-500 w-full mb-1">💡 이런 것들을 물어보세요:</span>
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-slate-800 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-700 hover:border-indigo-500/30 rounded-full px-3 py-1 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleFormSubmit}
        className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
};
