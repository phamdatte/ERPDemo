'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Customer } from '@/api/sales.api';

interface Props {
  customers: Customer[];
  mutation: any;
  onClose: () => void;
}

export function InvoiceModal({ customers, mutation, onClose }: Props) {
  const [form, setForm] = useState({
    invoiceNumber: '',
    customerId: '',
    invoiceDate: '',
    totalAmount: '',
    description: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      invoiceNumber: form.invoiceNumber,
      customerId: form.customerId,
      invoiceDate: form.invoiceDate,
      totalAmount: Number(form.totalAmount),
      description: form.description || undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Tạo hóa đơn</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <Input label="Số hóa đơn" name="invoiceNumber" value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Khách hàng</label>
            <select required value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="input-base">
              <option value="">-- Chọn khách hàng --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ngày hóa đơn</label>
            <input type="date" required value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} className="input-base" />
          </div>
          <Input label="Tổng tiền" name="totalAmount" type="number" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} />
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
