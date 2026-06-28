'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import {
  getJournalEntries,
  createJournalEntry,
  JournalEntry,
  JournalLine,
} from '@/api/accounting.api';
import { JournalEntryModal } from './JournalEntryModal';

export default function JournalEntriesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['journal-entries', page],
    queryFn: () => getJournalEntries({ page, size: 20 }),
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bút toán</h1>
          <p className="text-xs text-slate-400 mt-1">Tạo và theo dõi bút toán kế toán</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Tạo bút toán
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số chứng từ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Diễn giải</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nợ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Có</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={5} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="Chưa có bút toán" actionLabel="Tạo bút toán" onAction={() => setCreating(true)} /></td></tr>
              )}
              {content?.content.map((entry) => (
                <tr key={entry.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{entry.entryNumber}</td>
                  <td className="px-4 py-3 text-slate-700">{entry.entryDate}</td>
                  <td className="px-4 py-3 text-slate-500">{entry.description ?? '-'}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">{entry.totalDebit?.toLocaleString() ?? 0}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">{entry.totalCredit?.toLocaleString() ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {creating && <JournalEntryModal onClose={() => setCreating(false)} />}
    </div>
  );
}
