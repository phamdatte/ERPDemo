'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import clsx from 'clsx';

type ToastTone = 'success' | 'error';

interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

type Listener = (toasts: ToastItem[]) => void;

const listeners = new Set<Listener>();
let toasts: ToastItem[] = [];
let nextId = 1;

function emit() {
  listeners.forEach((l) => l(toasts));
}

function dispatch(tone: ToastTone, message: string) {
  const id = nextId++;
  toasts = [...toasts, { id, tone, message }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3000);
}

export const toast = {
  success: (message: string) => dispatch('success', message),
  error: (message: string) => dispatch('error', message),
};

const toneClasses: Record<ToastTone, string> = {
  success: 'border-green-200',
  error: 'border-red-200',
};

const Icon = ({ tone }: { tone: ToastTone }) =>
  tone === 'success' ? (
    <CheckCircle size={18} className="text-green-500 shrink-0" />
  ) : (
    <XCircle size={18} className="text-red-500 shrink-0" />
  );

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleCleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (items.length === 0) listeners.delete(setItems);
    }, 3200);
  }, [items.length]);

  useEffect(() => {
    listeners.add(setItems);
    setItems(toasts);
    return () => {
      listeners.delete(setItems);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (items.length > 0) scheduleCleanup();
  }, [items, scheduleCleanup]);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'pointer-events-auto flex items-center gap-3 bg-white border rounded-lg shadow-dropdown px-4 py-3 min-w-[280px] animate-[toast-in_0.2s_ease-out]',
            toneClasses[t.tone],
          )}
        >
          <Icon tone={t.tone} />
          <p className="text-sm text-slate-700 flex-1">{t.message}</p>
          <button
            onClick={() => {
              toasts = toasts.filter((x) => x.id !== t.id);
              emit();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
