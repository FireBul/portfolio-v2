import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Toast {
  id: string;
  message: string;
  tag: string;
}

// Custom event dispatcher for triggering messages from anywhere
export const triggerMessage = (message: string, tag: string = 'Info') => {
  window.dispatchEvent(new CustomEvent('in-app-message', { detail: { message, tag } }));
};

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

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener('in-app-message', handleMessage);
    return () => window.removeEventListener('in-app-message', handleMessage);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 md:px-0">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.2 } }}
            className="bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white p-4 rounded-2xl shadow-2xl flex flex-col gap-1 pointer-events-auto"
          >
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
              {msg.tag}
            </div>
            <div className="text-sm font-medium leading-relaxed">
              {msg.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
