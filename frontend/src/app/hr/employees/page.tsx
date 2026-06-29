'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  Employee,
} from '@/api/hr.api';
import { toast } from '@/components/ui/Toast';
import { EmployeeModal } from './EmployeeModal';

const statusLabels: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Vô hiệu',
  ON_LEAVE: 'Nghỉ phép',
};

export default function EmployeesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['employees', page],
    queryFn: () => getEmployees({ page, size: 20 }),
  });

  const del = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); toast.success('Xóa nhân viên thành công'); },
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nhân viên</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý hồ sơ nhân viên</p>
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã NV</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Họ tên</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phòng ban</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={6} />}
              {!isLoading && content?.content.length === 0 && (
                <tr><td colSpan={6}><EmptyState title="Chưa có nhân viên" actionLabel="Thêm nhân viên" onAction={() => setCreating(true)} /></td></tr>
              )}
              {content?.content.map((emp) => (
                <tr key={emp.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{emp.employeeCode}</td>
                  <td className="px-4 py-3 text-slate-700">{emp.fullName}</td>
                  <td className="px-4 py-3 text-slate-500">{emp.email ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{emp.departmentName ?? '-'}</td>
                  <td className="px-4 py-3"><Badge tone={emp.status === 'ACTIVE' ? 'success' : 'neutral'}>{statusLabels[emp.status] ?? emp.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" onClick={() => setEditing(emp)}><Pencil size={16} /></Button>
                      <Button variant="ghost" onClick={() => { if (window.confirm('Bạn chắc chắn muốn xóa nhân viên này?')) del.mutate(emp.id); }} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 size={16} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {content && content.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">Hiển thị {content.content.length} / {content.totalElements} kết quả</span>
            <div className="flex items-center gap-1">
              <Button variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Trước</Button>
              <Button variant="secondary" disabled={page >= content.totalPages - 1} onClick={() => setPage((p) => p + 1)}>Sau</Button>
            </div>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <EmployeeModal employee={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}
    </div>
  );
}
