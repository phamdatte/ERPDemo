import { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('bg-white rounded-lg border border-slate-200 shadow-card', className)}>
      {children}
    </div>
  );
}
