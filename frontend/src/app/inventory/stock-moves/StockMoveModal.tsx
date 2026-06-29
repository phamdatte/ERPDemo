'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createStockMove, Product, Warehouse } from '@/api/inventory.api';
import { toast } from '@/components/ui/Toast';

interface Props {
  products: Product[];
  warehouses: Warehouse[];
  mutation: any;
  onClose: () => void;
}

export function StockMoveModal({ products, warehouses, mutation, onClose }: Props) {
  const [form, setForm] = useState({
    productId: '',
    warehouseId: '',
    moveType: 'IN',
    quantity: '',
    note: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      productId: form.productId,
      warehouseId: form.warehouseId,
      moveType: form.moveType,
      quantity: Number(form.quantity),
      note: form.note || undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Lập phiếu nhập/xuất</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Sản phẩm" required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
            <Select label="Kho" required value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })}>
              <option value="">-- Chọn kho --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </Select>
            <Select label="Loại" required value={form.moveType} onChange={(e) => setForm({ ...form, moveType: e.target.value })}>
              <option value="IN">Nhập</option>
              <option value="OUT">Xuất</option>
            </Select>
            <Input label="Số lượng" name="quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <Input label="Ghi chú" name="note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
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
