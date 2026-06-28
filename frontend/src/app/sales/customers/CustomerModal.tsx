'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createCustomer, updateCustomer, Customer } from '@/api/sales.api';

interface Props {
  customer: Customer | null;
  onClose: () => void;
}

export function CustomerModal({ customer, onClose }: Props) {
  const qc = useQueryClient();
  const isEdit = Boolean(customer);
  const [form, setForm] = useState({ code: '', name: '', contactName: '', phone: '', email: '', address: '', taxCode: '' });

  useEffect(() => {
    if (customer) setForm({
      code: customer.code,
      name: customer.name,
      contactName: customer.contactName ?? '',
      phone: customer.phone ?? '',
      email: customer.email ?? '',
      address: customer.address ?? '',
      taxCode: customer.taxCode ?? '',
    });
  }, [customer]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Customer>) =>
      isEdit && customer ? updateCustomer(customer.id, payload) : createCustomer(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); onClose(); },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{isEdit ? 'Sửa khách hàng' : 'Thêm khách hàng'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <Input label="Mã khách hàng" name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} disabled={isEdit} />
          <Input label="Tên khách hàng" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Người liên hệ" name="contactName" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          <Input label="Điện thoại" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Địa chỉ" name="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="Mã số thuế" name="taxCode" value={form.taxCode} onChange={(e) => setForm({ ...form, taxCode: e.target.value })} />
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
