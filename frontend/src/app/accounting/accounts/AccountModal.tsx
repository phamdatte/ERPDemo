'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createAccount, updateAccount, ChartOfAccount } from '@/api/accounting.api';
import { toast } from '@/components/ui/Toast';

interface Props {
  account: ChartOfAccount | null;
  onClose: () => void;
}

export function AccountModal({ account, onClose }: Props) {
  const qc = useQueryClient();
  const isEdit = Boolean(account);
  const [form, setForm] = useState({ code: '', name: '', type: 'ASSET', description: '' });

  useEffect(() => {
    if (account) setForm({ code: account.code, name: account.name, type: account.type, description: account.description ?? '' });
  }, [account]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<ChartOfAccount>) =>
      isEdit && account ? updateAccount(account.id, payload) : createAccount(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast.success(isEdit ? 'Cập nhật tài khoản thành công' : 'Thêm tài khoản thành công'); onClose(); },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{isEdit ? 'Sửa tài khoản' : 'Thêm tài khoản'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Mã tài khoản" name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} disabled={isEdit} />
            <Input label="Tên tài khoản" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Select label="Loại" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="ASSET">Tài sản</option>
              <option value="LIABILITY">Nợ phải trả</option>
              <option value="EQUITY">Vốn chủ sở hữu</option>
              <option value="REVENUE">Doanh thu</option>
              <option value="EXPENSE">Chi phí</option>
            </Select>
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
