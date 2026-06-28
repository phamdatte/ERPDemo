'use client';

import { Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export function Topbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-14 fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-6">
      <div className="ml-68 flex items-center gap-3">
        <input
          placeholder="Tìm kiếm..."
          className="px-3 py-1.5 border border-slate-300 rounded text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <button className="flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-100 rounded px-2 py-1.5 transition-colors">
          <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-semibold">
            {user?.username?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <span className="font-medium">{user?.username ?? 'Admin'}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        <button
          onClick={logout}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
