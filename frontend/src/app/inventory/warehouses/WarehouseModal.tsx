'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createWarehouse, updateWarehouse, Warehouse } from '@/api/inventory.api';

interface Props {
  warehouse: Warehouse | null;
  onClose: () => void;
}

export function WarehouseModal({ warehouse, onClose }: Props) {
  const qc = useQueryClient();
  const isEdit = Boolean(warehouse);
  const [form, setForm] = useState({ code: '', name: '', description: '', address: '' });

  useEffect(() => {
    if (warehouse) setForm({
      code: warehouse.code,
      name: warehouse.name,
      description: warehouse.description ?? '',
      address: warehouse.address ?? '',
    });
  }, [warehouse]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Warehouse>) =>
      isEdit && warehouse ? updateWarehouse(warehouse.id, payload) : createWarehouse(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['warehouses'] }); onClose(); },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{isEdit ? 'Sửa kho' : 'Thêm kho'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <Input label="Mã kho" name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} disabled={isEdit} />
          <Input label="Tên kho" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Mô tả" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Địa chỉ" name="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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
