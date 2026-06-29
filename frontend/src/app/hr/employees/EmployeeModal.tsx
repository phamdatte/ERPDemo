'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createEmployee, updateEmployee, Employee } from '@/api/hr.api';
import { toast } from '@/components/ui/Toast';

interface Props {
  employee: Employee | null;
  onClose: () => void;
}

export function EmployeeModal({ employee, onClose }: Props) {
  const qc = useQueryClient();
  const isEdit = Boolean(employee);
  const [form, setForm] = useState({
    employeeCode: '', fullName: '', email: '', phone: '', gender: '',
    dateOfBirth: '', hireDate: '', status: 'ACTIVE', baseSalary: '',
  });

  useEffect(() => {
    if (employee) {
      setForm({
        employeeCode: employee.employeeCode, fullName: employee.fullName,
        email: employee.email ?? '', phone: employee.phone ?? '',
        gender: employee.gender ?? '', dateOfBirth: employee.dateOfBirth ?? '',
        hireDate: employee.hireDate, status: employee.status, baseSalary: employee.baseSalary?.toString() ?? '',
      });
    }
  }, [employee]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Employee>) =>
      isEdit && employee ? updateEmployee(employee.id, payload) : createEmployee(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); toast.success(isEdit ? 'Cập nhật nhân viên thành công' : 'Thêm nhân viên thành công'); onClose(); },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      ...form,
      baseSalary: form.baseSalary ? Number(form.baseSalary) : undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{isEdit ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Mã nhân viên" name="employeeCode" value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} disabled={isEdit} />
            <Input label="Họ tên" name="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Điện thoại" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Giới tính" name="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
            <Input label="Ngày sinh" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            <Input label="Ngày vào làm" name="hireDate" type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
            <Input label="Lương cơ bản" name="baseSalary" type="number" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} />
          </div>
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
