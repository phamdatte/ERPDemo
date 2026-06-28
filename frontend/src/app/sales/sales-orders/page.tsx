'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import {
  getCustomers,
  getSalesOrders,
  createSalesOrder,
  SalesOrder,
  Customer,
} from '@/api/sales.api';
import { getProducts, Product } from '@/api/inventory.api';
import { SalesOrderModal } from './SalesOrderModal';

const statusTones: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  DRAFT: 'warning',
  CONFIRMED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

export default function SalesOrdersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['sales-orders', page],
    queryFn: () => getSalesOrders({ page, size: 20 }),
  });

  const { data: customers } = useQuery({
    queryKey: ['customer-options'],
    queryFn: () => getCustomers({ page: 0, size: 200 }),
  });

  const { data: products } = useQuery({
    queryKey: ['product-options'],
    queryFn: () => getProducts({ page: 0, size: 200 }),
  });

  const mutation = useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales-orders'] }); setCreating(false); },
  });

  const content = data?.data;

  function totalLines(lines: SalesOrder['lines']) {
    return lines.reduce((sum, l) => sum + (l.lineTotal ?? 0), 0);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đơn bán hàng</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý đơn hàng bán ra</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Lập đơn
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số đơn</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={5} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="Chưa có đơn bán" actionLabel="Lập đơn" onAction={() => setCreating(true)} /></td>
                </tr>
              )}
              {content?.content.map((o) => (
                <tr key={o.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-slate-700">{o.customerName}</td>
                  <td className="px-4 py-3 text-slate-500">{o.orderDate}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTones[o.status] ?? 'neutral'}>{o.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">{totalLines(o.lines).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {creating && customers && products && (
        <SalesOrderModal
          customers={customers.data.content}
          products={products.data.content}
          mutation={mutation}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  );
}
