'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from '@/api/inventory.api';
import { ProductModal } from './ProductModal';

export default function ProductsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, keyword],
    queryFn: () => getProducts({ page, size: 20, keyword }),
  });

  const del = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sản phẩm</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý danh mục sản phẩm</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
            className="input-base max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Đơn vị</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Đơn giá</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={5} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="Chưa có sản phẩm" actionLabel="Thêm sản phẩm" onAction={() => setCreating(true)} /></td>
                </tr>
              )}
              {content?.content.map((p) => (
                <tr key={p.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{p.code}</td>
                  <td className="px-4 py-3 text-slate-700">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.unit ?? '-'}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{p.unitPrice != null ? p.unitPrice.toLocaleString('vi-VN') : '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" onClick={() => setEditing(p)}><Pencil size={16} /></Button>
                      <Button variant="ghost" onClick={() => del.mutate(p.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 size={16} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(creating || editing) && (
        <ProductModal product={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}
    </div>
  );
}
