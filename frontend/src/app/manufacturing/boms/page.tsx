'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import {
  getBillOfMaterials,
  createBillOfMaterial,
  BillOfMaterial,
} from '@/api/manufacturing.api';
import { getProducts } from '@/api/inventory.api';
import { BomModal } from './BomModal';

export default function BomsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['boms', page],
    queryFn: () => getBillOfMaterials({ page, size: 20 }),
  });

  const { data: products } = useQuery({
    queryKey: ['product-options'],
    queryFn: () => getProducts({ page: 0, size: 200 }),
  });

  const mutation = useMutation({
    mutationFn: createBillOfMaterial,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['boms'] }); setCreating(false); },
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Định mức sản xuất (BOM)</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý_bill_of_material</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Tạo BOM
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã BOM</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mô tả</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số dòng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={4} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={4}><EmptyState title="Chưa có BOM" actionLabel="Tạo BOM" onAction={() => setCreating(true)} /></td>
                </tr>
              )}
              {content?.content.map((bom) => (
                <tr key={bom.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{bom.code}</td>
                  <td className="px-4 py-3 text-slate-700">{bom.productName}</td>
                  <td className="px-4 py-3 text-slate-500">{bom.description ?? '-'}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{bom.lines?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {creating && products && (
        <BomModal
          products={products.data.content}
          mutation={mutation}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  );
}
