'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import {
  getBillOfMaterials,
  getWorkOrders,
  createWorkOrder,
  WorkOrder,
} from '@/api/manufacturing.api';
import { getWarehouses } from '@/api/inventory.api';
import { WorkOrderModal } from './WorkOrderModal';

const statusTones: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  DRAFT: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

export default function WorkOrdersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['work-orders', page],
    queryFn: () => getWorkOrders({ page, size: 20 }),
  });

  const { data: boms } = useQuery({
    queryKey: ['bom-options'],
    queryFn: () => getBillOfMaterials({ page: 0, size: 200 }),
  });

  const { data: warehouses } = useQuery({
    queryKey: ['warehouse-options'],
    queryFn: () => getWarehouses({ page: 0, size: 200 }),
  });

  const mutation = useMutation({
    mutationFn: createWorkOrder,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['work-orders'] }); setCreating(false); },
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lệnh sản xuất</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý_work_order</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Tạo lệnh
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số lệnh</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">BOM</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kho</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số lượng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={5} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="Chưa có lệnh sản xuất" actionLabel="Tạo lệnh" onAction={() => setCreating(true)} /></td>
                </tr>
              )}
              {content?.content.map((wo) => (
                <tr key={wo.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{wo.orderNumber}</td>
                  <td className="px-4 py-3 text-slate-700">{wo.bomCode ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{wo.warehouseName ?? '-'}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{wo.quantity?.toLocaleString('vi-VN') ?? '-'}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTones[wo.status] ?? 'neutral'}>{wo.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {creating && boms && warehouses && (
        <WorkOrderModal
          boms={boms.data.content}
          warehouses={warehouses.data.content}
          mutation={mutation}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  );
}
