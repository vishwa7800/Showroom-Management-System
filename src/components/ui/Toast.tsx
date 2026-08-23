'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, message?: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toast: addToast,
        success: (t, m) => addToast(t, m, 'success'),
        error: (t, m) => addToast(t, m, 'error'),
        warning: (t, m) => addToast(t, m, 'warning'),
        info: (t, m) => addToast(t, m, 'info'),
      }}
    >
      {children}
      {/* Toast Render Area */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const icon = {
            success: <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />,
            error: <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />,
            warning: <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />,
            info: <Info className="h-5 w-5 text-sky-600 flex-shrink-0" />,
          }[t.type];

          const bgClass = {
            success: 'border-emerald-200 bg-white text-slate-900',
            error: 'border-rose-200 bg-white text-slate-900',
            warning: 'border-amber-200 bg-white text-slate-900',
            info: 'border-sky-200 bg-white text-slate-900',
          }[t.type];

          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5 w-80 max-w-sm',
                bgClass
              )}
            >
              {icon}
              <div className="flex-1">
                <h4 className="text-sm font-semibold">{t.title}</h4>
                {t.message && <p className="text-xs text-slate-500 mt-0.5">{t.message}</p>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
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
