'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  Department,
} from '@/api/hr.api';
import { toast } from '@/components/ui/Toast';
import { DepartmentModal } from './DepartmentModal';

export default function DepartmentsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Department | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['departments', page],
    queryFn: () => getDepartments({ page, size: 20 }),
  });

  const del = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); toast.success('Xóa phòng ban thành công'); },
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Phòng ban</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý cấu trúc phòng ban</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên phòng ban</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mô tả</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={4} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={4}><EmptyState title="Chưa có phòng ban" actionLabel="Thêm phòng ban" onAction={() => setCreating(true)} /></td>
                </tr>
              )}
              {content?.content.map((d) => (
                <tr key={d.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{d.code}</td>
                  <td className="px-4 py-3 text-slate-700">{d.name}</td>
                  <td className="px-4 py-3 text-slate-500">{d.description ?? '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" onClick={() => setEditing(d)}><Pencil size={16} /></Button>
                      <Button variant="ghost" onClick={() => { if (window.confirm('Bạn chắc chắn muốn xóa phòng ban này?')) del.mutate(d.id); }} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 size={16} /></Button>
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
        <DepartmentModal department={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}
    </div>
  );
}
