'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createJournalEntry, getAccounts, ChartOfAccount } from '@/api/accounting.api';
import { toast } from '@/components/ui/Toast';

interface Props {
  onClose: () => void;
}

export function JournalEntryModal({ onClose }: Props) {
  const qc = useQueryClient();
  const { data: accountsData } = useQuery({ queryKey: ['accounts'], queryFn: () => getAccounts({ size: 200 }) });
  const accounts = accountsData?.data?.content ?? [];

  const [form, setForm] = useState({ entryNumber: '', entryDate: '', description: '', reference: '' });
  const [lines, setLines] = useState<{ accountId: string; description: string; debit: string; credit: string }[]>([
    { accountId: '', description: '', debit: '', credit: '' },
    { accountId: '', description: '', debit: '', credit: '' },
  ]);

  const mutation = useMutation({
    mutationFn: () => createJournalEntry({
      ...form,
      lines: lines
        .filter((l) => l.accountId)
        .map((l) => ({
          accountId: l.accountId,
          description: l.description || undefined,
          debit: l.debit ? Number(l.debit) : undefined,
          credit: l.credit ? Number(l.credit) : undefined,
        })),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['journal-entries'] }); toast.success('Tạo bút toán thành công'); onClose(); },
  });

  function updateLine(i: number, field: string, value: string) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { accountId: '', description: '', debit: '', credit: '' }]);
  }

  function removeLine(i: number) {
    setLines((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Tạo bút toán</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Số chứng từ" name="entryNumber" value={form.entryNumber} onChange={(e) => setForm({ ...form, entryNumber: e.target.value })} />
            <Input label="Ngày" name="entryDate" type="date" value={form.entryDate} onChange={(e) => setForm({ ...form, entryDate: e.target.value })} />
            <Input label="Diễn giải" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input label="Tham chiếu" name="reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Phát sinh</p>
              <Button type="button" variant="secondary" onClick={addLine}><Plus size={14} /> Thêm dòng</Button>
            </div>
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">Tài khoản</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">Diễn giải</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500 w-32">Nợ</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500 w-32">Có</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((line, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">
                        <Select value={line.accountId} onChange={(e) => updateLine(i, 'accountId', e.target.value)}>
                          <option value="">-- Chọn --</option>
                          {accounts.map((a) => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                        </Select>
                      </td>
                      <td className="px-3 py-2"><input className="input-base" value={line.description} onChange={(e) => updateLine(i, 'description', e.target.value)} /></td>
                      <td className="px-3 py-2"><input type="number" className="input-base text-right" value={line.debit} onChange={(e) => updateLine(i, 'debit', e.target.value)} /></td>
                      <td className="px-3 py-2"><input type="number" className="input-base text-right" value={line.credit} onChange={(e) => updateLine(i, 'credit', e.target.value)} /></td>
                      <td className="px-3 py-2">
                        <button type="button" onClick={() => removeLine(i)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {mutation.isError && <p className="text-xs text-red-600">{(mutation.error as any)?.response?.data?.message ?? 'Có lỗi xảy ra'}</p>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Đang lưu...' : 'Lưu'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
