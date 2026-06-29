'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { getRoles, deleteRole, Role } from '@/api/admin.api';
import { toast } from '@/components/ui/Toast';
import { RoleModal } from './RoleModal';

export default function RolesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Role | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['roles-page', page],
    queryFn: () => getRoles({ page, size: 20 }),
  });

  const del = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roles-page'] }); toast.success('Xóa vai trò thành công'); },
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vai trò</h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý vai trò và quyền hệ thống
          </p>
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mã
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={4} />}
              {!isLoading && content?.content.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      title="Chưa có vai trò"
                      actionLabel="Thêm vai trò"
                      onAction={() => setCreating(true)}
                    />
                  </td>
                </tr>
              )}
              {content?.content.map((role) => (
                <tr key={role.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3">
                    <Badge tone="info">{role.code}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{role.name}</td>
                  <td className="px-4 py-3 text-slate-500">{role.description ?? '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" onClick={() => setEditing(role)}>
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => { if (window.confirm('Bạn chắc chắn muốn xóa vai trò này?')) del.mutate(role.id); }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(creating || editing) && (
        <RoleModal
          role={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
