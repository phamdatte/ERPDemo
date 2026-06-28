'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import { login } from '@/api/auth.api';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ username, password });
      setAuth(res.data.token, { username: res.data.username, roles: res.data.roles });
      router.replace('/admin/users');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="card w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">ERP Demo</h1>
          <p className="text-xs text-slate-400 mt-1">Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên đăng nhập"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Mật khẩu"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>
      </div>
    </div>
  );
}
