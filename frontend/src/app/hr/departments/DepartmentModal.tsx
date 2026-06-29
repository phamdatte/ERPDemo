'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createDepartment, updateDepartment, Department } from '@/api/hr.api';
import { toast } from '@/components/ui/Toast';

interface Props {
  department: Department | null;
  onClose: () => void;
}

export function DepartmentModal({ department, onClose }: Props) {
  const qc = useQueryClient();
  const isEdit = Boolean(department);
  const [form, setForm] = useState({ code: '', name: '', description: '' });

  useEffect(() => {
    if (department) setForm({ code: department.code, name: department.name, description: department.description ?? '' });
  }, [department]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Department>) =>
      isEdit && department ? updateDepartment(department.id, payload) : createDepartment(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); toast.success(isEdit ? 'Cập nhật phòng ban thành công' : 'Thêm phòng ban thành công'); onClose(); },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{isEdit ? 'Sửa phòng ban' : 'Thêm phòng ban'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <Input label="Mã phòng ban" name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} disabled={isEdit} />
          <Input label="Tên phòng ban" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Mô tả" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {mutation.isError && <p className="text-xs text-red-600">{(mutation.error as any)?.response?.data?.message ?? 'Có lỗi xảy ra'}</p>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Đang lưu...' : 'Lưu'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
