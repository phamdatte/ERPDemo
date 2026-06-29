'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createProduct, updateProduct, Product } from '@/api/inventory.api';
import { toast } from '@/components/ui/Toast';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  const qc = useQueryClient();
  const isEdit = Boolean(product);
  const [form, setForm] = useState({ code: '', name: '', description: '', unit: '', unitPrice: '' });

  useEffect(() => {
    if (product) setForm({
      code: product.code,
      name: product.name,
      description: product.description ?? '',
      unit: product.unit ?? '',
      unitPrice: product.unitPrice != null ? String(product.unitPrice) : '',
    });
  }, [product]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Product>) =>
      isEdit && product ? updateProduct(product.id, payload) : createProduct(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); toast.success(isEdit ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công'); onClose(); },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      code: form.code,
      name: form.name,
      description: form.description || undefined,
      unit: form.unit || undefined,
      unitPrice: form.unitPrice ? Number(form.unitPrice) : undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Mã sản phẩm" name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} disabled={isEdit} />
            <Input label="Tên sản phẩm" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Đơn vị" name="unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <Input label="Đơn giá" name="unitPrice" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
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
