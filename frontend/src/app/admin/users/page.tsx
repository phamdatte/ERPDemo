'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import {
  getUsers,
  deleteUser,
  User,
  getAllRoles,
  assignRoles,
} from '@/api/admin.api';
import { UserModal } from './UserModal';
import { RolesModal } from './RolesModal';

export default function UsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const [rolesForUser, setRolesForUser] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers({ page, size: 20 }),
  });

  const del = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const content = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Người dùng</h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý tài khoản và vai trò người dùng
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
                  Tên đăng nhập
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <TableRowSkeleton columns={5} />}
              {!isLoading && content?.content.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      title="Chưa có người dùng"
                      actionLabel="Thêm người dùng"
                      onAction={() => setCreating(true)}
                    />
                  </td>
                </tr>
              )}
              {content?.content.map((user) => (
                <tr key={user.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{user.username}</td>
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
                  <td className="px-4 py-3 text-slate-700">{user.fullName ?? '-'}</td>
                  <td className="px-4 py-3">
                    <Badge tone={user.active ? 'success' : 'neutral'}>
                      {user.active ? 'Hoạt động' : 'Vô hiệu'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" onClick={() => setRolesForUser(user)}>
                        <Shield size={16} />
                      </Button>
                      <Button variant="ghost" onClick={() => setEditing(user)}>
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => del.mutate(user.id)}
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

        {content && content.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Hiển thị {content.content.length} / {content.totalElements} kết quả
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Trước
              </Button>
              <Button
                variant="secondary"
                disabled={page >= content.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <UserModal
          user={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      {rolesForUser && (
        <RolesModal
          user={rolesForUser}
          onClose={() => setRolesForUser(null)}
        />
      )}
    </div>
  );
}
