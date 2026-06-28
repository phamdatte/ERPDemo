import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'Chưa có dữ liệu',
  message = 'Thêm mới để bắt đầu',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
        <Inbox size={24} />
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          + {actionLabel}
        </Button>
      )}
    </div>
  );
}
