'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-68">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 mt-14">{children}</main>
      </div>
    </div>
  );
}
