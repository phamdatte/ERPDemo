'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createUser, updateUser, User } from '@/api/admin.api';
import { toast } from '@/components/ui/Toast';

interface Props {
  user: User | null;
  onClose: () => void;
}

export function UserModal({ user, onClose }: Props) {
  const qc = useQueryClient();
  const isEdit = Boolean(user);

  const [form, setForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    active: true,
    roleIds: [] as string[],
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        fullName: user.fullName ?? '',
        password: '',
        active: user.active,
        roleIds: user.roles.map((r) => r.id),
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<User> & { password?: string }) =>
      isEdit && user
        ? updateUser(user.id, payload)
        : createUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success(isEdit ? 'Cập nhật người dùng thành công' : 'Thêm người dùng thành công');
      onClose();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = {
      email: form.email,
      fullName: form.fullName,
      active: form.active,
      roleIds: form.roleIds,
    };
    if (!isEdit) {
      payload.username = form.username;
      payload.password = form.password;
    }
    mutation.mutate(payload);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? 'Sửa người dùng' : 'Thêm người dùng'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <Input
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={isEdit}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Họ tên"
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          {!isEdit && (
            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              hint="Tối thiểu 6 ký tự"
            />
          )}

          {mutation.isError && (
            <p className="text-xs text-red-600">
              {(mutation.error as any)?.response?.data?.message ?? 'Có lỗi xảy ra'}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
