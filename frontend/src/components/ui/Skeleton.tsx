import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('h-4 bg-slate-200 rounded animate-pulse', className)} />;
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="w-24" />
        </td>
      ))}
    </tr>
  );
}
