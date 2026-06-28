'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Product } from '@/api/inventory.api';

interface LineDraft {
  productId: string;
  quantity: string;
}

interface Props {
  products: Product[];
  mutation: any;
  onClose: () => void;
}

export function BomModal({ products, mutation, onClose }: Props) {
  const [form, setForm] = useState({ code: '', productId: '', description: '' });
  const [lines, setLines] = useState<LineDraft[]>([{ productId: '', quantity: '1' }]);

  function updateLine(i: number, field: keyof LineDraft, value: string) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { productId: '', quantity: '1' }]);
  }

  function removeLine(i: number) {
    setLines((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      code: form.code,
      productId: form.productId,
      description: form.description || undefined,
      lines: lines
        .filter((l) => l.productId)
        .map((l) => ({ productId: l.productId, quantity: Number(l.quantity) })),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Tạo BOM</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Mã BOM" name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sản phẩm thành phẩm</label>
              <select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="input-base">
                <option value="">-- Chọn sản phẩm --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <Input label="Mô tả" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Nguyên vật liệu</span>
              <Button type="button" variant="secondary" onClick={addLine}><Plus size={14} /> Thêm dòng</Button>
            </div>
            <div className="space-y-2">
              {lines.map((line, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-7">
                    <select value={line.productId} onChange={(e) => updateLine(i, 'productId', e.target.value)} className="input-base text-sm">
                      <option value="">-- Nguyên vật liệu --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-4">
                    <input type="number" min="0.01" step="0.01" placeholder="Số lượng" value={line.quantity} onChange={(e) => updateLine(i, 'quantity', e.target.value)} className="input-base text-sm" />
                  </div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" onClick={() => removeLine(i)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {mutation.isError && <p className="text-xs text-red-600">{(mutation.error as any)?.response?.data?.message ?? 'Có lỗi xảy ra'}</p>}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Đang lưu...' : 'Lưu'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
