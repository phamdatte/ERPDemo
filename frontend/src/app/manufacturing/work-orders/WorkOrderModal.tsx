'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BillOfMaterial } from '@/api/manufacturing.api';
import { Warehouse } from '@/api/inventory.api';

interface Props {
  boms: BillOfMaterial[];
  warehouses: Warehouse[];
  mutation: any;
  onClose: () => void;
}

export function WorkOrderModal({ boms, warehouses, mutation, onClose }: Props) {
  const [form, setForm] = useState({
    orderNumber: '',
    bomId: '',
    warehouseId: '',
    quantity: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      orderNumber: form.orderNumber,
      bomId: form.bomId || undefined,
      warehouseId: form.warehouseId || undefined,
      quantity: Number(form.quantity),
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      description: form.description || undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Tạo lệnh sản xuất</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <Input label="Số lệnh" name="orderNumber" value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">BOM</label>
            <select value={form.bomId} onChange={(e) => setForm({ ...form, bomId: e.target.value })} className="input-base">
              <option value="">-- Chọn BOM --</option>
              {boms.map((b) => (
                <option key={b.id} value={b.id}>{b.code} - {b.productName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kho xuất</label>
            <select value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} className="input-base">
              <option value="">-- Chọn kho --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <Input label="Số lượng" name="quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày bắt đầu</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày kết thúc</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input-base" />
            </div>
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
