import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Activity, Zap } from 'lucide-react';

export type ToastType = 'info' | 'analytics' | 'prediction';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Custom event dispatcher for triggering messages from anywhere
export const triggerMessage = (message: string, type: ToastType = 'info') => {
  window.dispatchEvent(new CustomEvent('in-app-message', { detail: { message, type } }));
};

export const InAppMessages: React.FC = () => {
  const [messages, setMessages] = useState<Toast[]>([]);

  useEffect(() => {
    const handleMessage = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newToast: Toast = {
        id: Date.now().toString() + Math.random().toString(),
        message: customEvent.detail.message,
        type: customEvent.detail.type,
      };
      
      setMessages((prev) => [...prev, newToast]);

      // Auto-remove after 4.5 seconds
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== newToast.id));
      }, 4500);
    };

    window.addEventListener('in-app-message', handleMessage);
    return () => window.removeEventListener('in-app-message', handleMessage);
  }, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-md px-4">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
            className="bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3 pointer-events-auto"
          >
            <div className="mt-0.5">
              {msg.type === 'analytics' && <Activity className="w-5 h-5 text-emerald-400" />}
              {msg.type === 'prediction' && <Zap className="w-5 h-5 text-amber-400" />}
              {msg.type === 'info' && <Bell className="w-5 h-5 text-indigo-400" />}
            </div>
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {msg.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
