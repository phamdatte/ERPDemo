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
  getCustomers,
  getInvoices,
  createInvoice,
  Invoice,
} from '@/api/sales.api';
import { toast } from '@/components/ui/Toast';
import { InvoiceModal } from './InvoiceModal';

const statusTones: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  UNPAID: 'warning',
  PAID: 'success',
  CANCELLED: 'error',
};

const statusLabels: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
};

export default function InvoicesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', page],
    queryFn: () => getInvoices({ page, size: 20 }),
  });

  const { data: customers } = useQuery({
    queryKey: ['customer-options'],
    queryFn: () => getCustomers({ page: 0, size: 200 }),
  });

  const mutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices'] }); toast.success('Tạo hóa đơn thành công'); setCreating(false); },
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hóa đơn</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý hóa đơn bán hàng</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Tạo hóa đơn
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số hóa đơn</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={5} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="Chưa có hóa đơn" actionLabel="Tạo hóa đơn" onAction={() => setCreating(true)} /></td>
                </tr>
              )}
              {content?.content.map((inv) => (
                <tr key={inv.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-slate-700">{inv.customerName}</td>
                  <td className="px-4 py-3 text-slate-500">{inv.invoiceDate}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTones[inv.status] ?? 'neutral'}>{statusLabels[inv.status] ?? inv.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">{inv.totalAmount?.toLocaleString('vi-VN') ?? '-'}</td>
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

      {creating && customers && (
        <InvoiceModal
          customers={customers.data.content}
          mutation={mutation}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  );
}
