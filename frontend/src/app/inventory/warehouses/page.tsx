'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  Warehouse,
} from '@/api/inventory.api';
import { toast } from '@/components/ui/Toast';
import { WarehouseModal } from './WarehouseModal';

export default function WarehousesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['warehouses', page, keyword],
    queryFn: () => getWarehouses({ page, size: 20, keyword }),
  });

  const del = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['warehouses'] }); toast.success('Xóa kho thành công'); },
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kho</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý danh sách kho</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <input
            type="text"
            placeholder="Tìm theo tên kho..."
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên kho</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Địa chỉ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={4} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={4}><EmptyState title="Chưa có kho" actionLabel="Thêm kho" onAction={() => setCreating(true)} /></td>
                </tr>
              )}
              {content?.content.map((w) => (
                <tr key={w.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{w.code}</td>
                  <td className="px-4 py-3 text-slate-700">{w.name}</td>
                  <td className="px-4 py-3 text-slate-500">{w.address ?? '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" onClick={() => setEditing(w)}><Pencil size={16} /></Button>
                      <Button variant="ghost" onClick={() => { if (window.confirm('Bạn chắc chắn muốn xóa kho này?')) del.mutate(w.id); }} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 size={16} /></Button>
                    </div>
                  </td>
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

      {(creating || editing) && (
        <WarehouseModal warehouse={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}
    </div>
  );
}
