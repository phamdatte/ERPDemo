'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import {
  getAccounts,
  createAccount,
  deleteAccount,
  ChartOfAccount,
} from '@/api/accounting.api';
import { AccountModal } from './AccountModal';

const typeTones: Record<string, 'info' | 'success' | 'warning' | 'error' | 'neutral'> = {
  ASSET: 'info', LIABILITY: 'warning', EQUITY: 'success', REVENUE: 'success', EXPENSE: 'error',
};

export default function AccountsPage() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts({ size: 200 }),
  });

  const del = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });

  const accounts = data?.data?.content ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Danh mục tài khoản</h1>
          <p className="text-xs text-slate-400 mt-1">Hệ thống tài khoản kế toán</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên tài khoản</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Loại</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mô tả</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={5} />}
              {!isLoading && accounts.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="Chưa có tài khoản" actionLabel="Thêm tài khoản" onAction={() => setCreating(true)} /></td></tr>
              )}
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{acc.code}</td>
                  <td className="px-4 py-3 text-slate-700">{acc.name}</td>
                  <td className="px-4 py-3"><Badge tone={typeTones[acc.type] ?? 'neutral'}>{acc.type}</Badge></td>
                  <td className="px-4 py-3 text-slate-500">{acc.description ?? '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" onClick={() => del.mutate(acc.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 size={16} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {creating && <AccountModal onClose={() => setCreating(false)} />}
    </div>
  );
}
