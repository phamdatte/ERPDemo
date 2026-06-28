'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createAccount } from '@/api/accounting.api';

interface Props {
  onClose: () => void;
}

export function AccountModal({ onClose }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ code: '', name: '', type: 'ASSET', description: '' });

  const mutation = useMutation({
    mutationFn: () => createAccount(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); onClose(); },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Thêm tài khoản</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <Input label="Mã tài khoản" name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <Input label="Tên tài khoản" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Loại</label>
            <select className="input-base" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="ASSET">ASSET - Tài sản</option>
              <option value="LIABILITY">LIABILITY - Nợ phải trả</option>
              <option value="EQUITY">EQUITY - Vốn chủ sở hữu</option>
              <option value="REVENUE">REVENUE - Doanh thu</option>
              <option value="EXPENSE">EXPENSE - Chi phí</option>
            </select>
          </div>
          <Input label="Mô tả" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
