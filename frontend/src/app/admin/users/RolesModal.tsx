'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getAllRoles, assignRoles, User } from '@/api/admin.api';

interface Props {
  user: User;
  onClose: () => void;
}

export function RolesModal({ user, onClose }: Props) {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);

  const { data: rolesData } = useQuery({
    queryKey: ['roles-all'],
    queryFn: () => getAllRoles(),
  });

  useEffect(() => {
    setSelected(user.roles.map((r) => r.id));
  }, [user]);

  const mutation = useMutation({
    mutationFn: () => assignRoles(user.id, selected),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
  });

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const roles = rolesData?.data ?? [];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Gán vai trò — {user.username}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-2 max-h-80 overflow-y-auto">
          {roles.map((role) => (
            <label
              key={role.id}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(role.id)}
                onChange={() => toggle(role.id)}
                className="rounded border-slate-300"
              />
              <div>
                <p className="text-sm font-medium text-slate-700">{role.name}</p>
                <p className="text-xs font-mono text-slate-400">{role.code}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </div>
    </div>
  );
}
