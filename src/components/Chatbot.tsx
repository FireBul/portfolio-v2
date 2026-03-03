import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, MinusCircle, Sparkles, Loader2 } from 'lucide-react';
import { askGemini, getModelInfo } from '../utils/gemini';
import { trackEvent } from '../utils/analytics';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 저는 최원혁의 포트폴리오 AI 어시스턴트입니다. 프로젝트, 경력, 기술 스택 등 궁금한 점을 물어보세요 🚀',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modelInfo = getModelInfo();

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    trackEvent('chatbot', 'open');

    const count = parseInt(localStorage.getItem('portfolio_chat_count') || '0');
    localStorage.setItem('portfolio_chat_count', (count + 1).toString());
  };

  const handleClose = () => {
    setIsOpen(false);
    trackEvent('chatbot', 'close');
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    trackEvent('chatbot', 'minimize');
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    trackEvent('chatbot', 'send_message');

    try {
      // Build conversation history (last 10 messages for context)
      const history = messages
        .filter(m => m.id !== '1') // Skip initial greeting
        .slice(-10)
        .map(m => ({
          role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
          text: m.text
        }));

      const response = await askGemini(userText, history);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: '죄송합니다, 응답 중 오류가 발생했습니다. 다시 시도해 주세요.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105 z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105 z-50 flex items-center gap-2 font-medium"
      >
        <Sparkles size={18} />
        <span>AI Chat</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Portfolio AI Assistant</h3>
            <p className="text-slate-400 text-[10px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {modelInfo.display} · {modelInfo.provider}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <button onClick={handleMinimize} className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors">
            <MinusCircle size={18} />
          </button>
          <button onClick={handleClose} className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Model Info Banner */}
      <div className="bg-indigo-950/50 border-b border-indigo-500/20 px-4 py-2 flex items-center gap-2">
        <Sparkles size={12} className="text-indigo-400 flex-shrink-0" />
        <p className="text-indigo-300/80 text-[10px] leading-tight">
          Powered by <span className="font-semibold text-indigo-300">{modelInfo.display}</span> — 포트폴리오 전체 내용을 학습한 AI가 실시간으로 답변합니다
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto h-72 flex flex-col gap-4 bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
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

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
