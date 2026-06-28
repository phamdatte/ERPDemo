import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    'inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700 active:bg-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors',
  danger:
    'inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors',
  ghost:
    'p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => (
    <button ref={ref} className={clsx(variants[variant], className)} {...props} />
  ),
);
Button.displayName = 'Button';
