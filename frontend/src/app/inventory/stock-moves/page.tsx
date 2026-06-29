'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import {
  getStockMoves,
  getProducts,
  getWarehouses,
  createStockMove,
  StockMove,
} from '@/api/inventory.api';
import { toast } from '@/components/ui/Toast';
import { StockMoveModal } from './StockMoveModal';

export default function StockMovesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['stock-moves', page],
    queryFn: () => getStockMoves({ page, size: 20 }),
  });

  const { data: products } = useQuery({
    queryKey: ['product-options'],
    queryFn: () => getProducts({ page: 0, size: 200 }),
  });

  const { data: warehouses } = useQuery({
    queryKey: ['warehouse-options'],
    queryFn: () => getWarehouses({ page: 0, size: 200 }),
  });

  const mutation = useMutation({
    mutationFn: createStockMove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock-moves'] }); toast.success('Lập phiếu thành công'); setCreating(false); },
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Phiếu nhập/xuất</h1>
          <p className="text-xs text-slate-400 mt-1">Theo dõi biến động tồn kho</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Lập phiếu
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kho</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Loại</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số lượng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={5} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="Chưa có phiếu nhập/xuất" actionLabel="Lập phiếu" onAction={() => setCreating(true)} /></td>
                </tr>
              )}
              {content?.content.map((m) => (
                <tr key={m.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-slate-700">{m.productName}</div>
                    <div className="text-xs font-mono text-slate-400">{m.productCode}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{m.warehouseName}</td>
                  <td className="px-4 py-3">
                    <Badge tone={m.moveType === 'IN' ? 'success' : 'error'}>{m.moveType === 'IN' ? 'Nhập' : 'Xuất'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">{m.quantity.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-3 text-slate-500">{m.note ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {content && (
          <Pagination
            page={content.pageNumber}
            totalPages={content.totalPages}
            totalElements={content.totalElements}
            pageSize={content.pageSize}
            onPageChange={setPage}
          />
        )}
      </div>

      {creating && products && warehouses && (
        <StockMoveModal
          products={products.data.content}
          warehouses={warehouses.data.content}
          mutation={mutation}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  );
}
