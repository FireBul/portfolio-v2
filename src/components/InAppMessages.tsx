import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GEMINI_DISPLAY } from '../utils/geminiInsights';

export interface Toast {
  id: string;
  message: string;
  tag: string;
}

// Custom event dispatcher for triggering messages from anywhere
export const triggerMessage = (message: string, tag: string = 'Info') => {
  window.dispatchEvent(new CustomEvent('in-app-message', { detail: { message, tag } }));
};

const isGeminiTag = (tag: string) => tag.toLowerCase().includes('gemini');

export const InAppMessages: React.FC = () => {
  const [messages, setMessages] = useState<Toast[]>([]);

  useEffect(() => {
    const handleMessage = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newToast: Toast = {
        id: Date.now().toString() + Math.random().toString(),
        message: customEvent.detail.message,
        tag: customEvent.detail.tag,
      };

      setMessages((prev) => [...prev, newToast]);

      // Gemini toasts stay longer (8s) than regular (5s)
      const duration = isGeminiTag(newToast.tag) ? 8000 : 5000;
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== newToast.id));
      }, duration);
    };

    window.addEventListener('in-app-message', handleMessage);
    return () => window.removeEventListener('in-app-message', handleMessage);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 md:px-0">
      <AnimatePresence>
        {messages.map((msg) => {
          const gemini = isGeminiTag(msg.tag);
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.2 } }}
              className={`backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex flex-col gap-1 pointer-events-auto ${
                gemini
                  ? 'bg-gradient-to-r from-amber-900/90 to-slate-900/95 border border-amber-500/30'
                  : 'bg-slate-900/95 border border-slate-700'
              }`}
            >
              <div className={`text-[10px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 ${
                gemini ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {gemini && <Sparkles className="w-3 h-3" />}
                {msg.tag}
              </div>
              <div className="text-sm font-medium leading-relaxed">
                {msg.message}
              </div>
              {gemini && (
                <div className="text-[9px] text-white/20 font-mono mt-1">
                  Powered by {GEMINI_DISPLAY}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
