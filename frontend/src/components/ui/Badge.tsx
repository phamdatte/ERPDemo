import { ReactNode } from 'react';
import clsx from 'clsx';

type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const tones: Record<Tone, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-slate-100 text-slate-600',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
