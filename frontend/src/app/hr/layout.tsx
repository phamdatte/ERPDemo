'use client';

import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ModuleLayout({ children }: { children: ReactNode }) {
  const authenticated = useAuthGuard();

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Skeleton className="w-48" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
