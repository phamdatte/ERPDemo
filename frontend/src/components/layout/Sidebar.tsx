'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Users,
  Shield,
  Building2,
  UserCheck,
  Boxes,
  ShoppingCart,
  FileText,
  BarChart2,
  Wallet,
  BookOpen,
  Settings,
} from 'lucide-react';

const navSections = [
  {
    heading: 'Quản trị',
    items: [
      { href: '/admin/users', label: 'Người dùng', icon: Users },
      { href: '/admin/roles', label: 'Vai trò', icon: Shield },
    ],
  },
  {
    heading: 'Nhân sự',
    items: [
      { href: '/hr/employees', label: 'Nhân viên', icon: UserCheck },
      { href: '/hr/departments', label: 'Phòng ban', icon: Building2 },
    ],
  },
  {
    heading: 'Kế toán',
    items: [
      { href: '/accounting/accounts', label: 'Tài khoản', icon: Wallet },
      { href: '/accounting/journal-entries', label: 'Bút toán', icon: BookOpen },
    ],
  },
  {
    heading: 'Module',
    items: [
      { href: '#', label: 'Kho', icon: Boxes },
      { href: '#', label: 'Mua hàng', icon: ShoppingCart },
      { href: '#', label: 'Bán hàng', icon: FileText },
      { href: '/reporting', label: 'Báo cáo', icon: BarChart2 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-68 bg-primary-900 z-40 flex flex-col">
      <div className="h-14 flex items-center px-5 border-b border-white/10">
        <span className="text-white text-lg font-bold tracking-wide">ERP Demo</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.heading}>
            <p className="text-xs text-slate-500 uppercase tracking-wider px-3 mb-1">
              {section.heading}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href !== '#' && pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-300 hover:bg-primary-700/60 hover:text-white',
                    )}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded text-sm font-medium text-slate-300 hover:bg-primary-700/60 hover:text-white transition-colors"
        >
          <Settings size={16} className="shrink-0" />
          <span>Cài đặt</span>
        </Link>
      </div>
    </aside>
  );
}
