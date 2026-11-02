'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'error', title = '', message = '', duration = 6000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const error = useCallback((message, title = 'Terjadi Kesalahan') => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const success = useCallback((message, title = 'Berhasil') => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const warning = useCallback((message, title = 'Peringatan') => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, error, success, warning }}>
      {children}
      {/* Toast Notification Container in Bottom-Right */}
      <aside aria-label="Notifikasi Sistem" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none no-print">
        <AnimatePresence>
          {toasts.map(toast => {
            const isError = toast.type === 'error';
            const isSuccess = toast.type === 'success';

            const bgClass = isError 
              ? 'bg-[#FFF0F0] border-l-8 border-l-red-600' 
              : isSuccess 
              ? 'bg-[#F0FFF4] border-l-8 border-l-emerald-600' 
              : 'bg-[#FFFDF0] border-l-8 border-l-[#FFE600]';

            const icon = isError ? (
              <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
            ) : isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-800 flex-shrink-0 mt-0.5" />
            );

            return (
              <motion.div
                key={toast.id}
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto nb-card p-3.5 border-2 border-black flex items-start justify-between gap-3 ${bgClass}`}
              >
                <div className="flex items-start gap-2.5">
                  {icon}
                  <div className="space-y-0.5 pr-2">
                    {toast.title && (
                      <p className="font-black text-xs uppercase tracking-tight text-black">
                        {toast.title}
                      </p>
                    )}
                    <p className="text-xs font-bold text-neutral-900 leading-snug">
                      {toast.message}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="p-1 hover:bg-black/10 border border-black/20 text-neutral-800 flex-shrink-0 transition-colors"
                  aria-label="Tutup notifikasi"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
