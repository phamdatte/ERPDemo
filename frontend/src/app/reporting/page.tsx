'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  ShoppingCart,
  Boxes,
  BookOpen,
  Truck,
  Settings,
  UserCheck,
  TrendingUp,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import {
  getDashboardStats,
  getRevenueByMonth,
  getHeadcount,
  getInventoryTurnover,
  exportExcel,
  DashboardStat,
} from '@/api/reporting.api';

const iconMap: Record<string, typeof Users> = {
  'users': Users,
  'shopping-cart': ShoppingCart,
  'boxes': Boxes,
  'book-open': BookOpen,
  'truck': Truck,
  'settings': Settings,
};

const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const formatVND = (v: number | string | null) => {
  if (v == null) return '0';
  const num = typeof v === 'string' ? parseFloat(v) : v;
  return num.toLocaleString('vi-VN');
};

export default function ReportingPage() {
  const [exporting, setExporting] = useState<string | null>(null);

  const { data: dashboardData, isLoading: loadingDashboard } = useQuery({
    queryKey: ['reporting-dashboard'],
    queryFn: getDashboardStats,
  });

  const { data: revenueData, isLoading: loadingRevenue } = useQuery({
    queryKey: ['reporting-revenue'],
    queryFn: () => getRevenueByMonth(2026),
  });

  const { data: headcountData, isLoading: loadingHeadcount } = useQuery({
    queryKey: ['reporting-headcount'],
    queryFn: getHeadcount,
  });

  const { data: inventoryData, isLoading: loadingInventory } = useQuery({
    queryKey: ['reporting-inventory'],
    queryFn: getInventoryTurnover,
  });

  async function handleExport(module: string) {
    setExporting(module);
    try {
      const blob = await exportExcel(module);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${module}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  }

  const stats = dashboardData?.data ?? [];
  const revenue = revenueData?.data ?? [];
  const headcount = headcountData?.data ?? [];
  const inventory = inventoryData?.data ?? [];

  const pieData = headcount.map((h) => ({
    name: h.departmentName || h.departmentCode,
    value: h.employeeCount,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Báo cáo & Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng hợp dữ liệu từ tất cả module trong hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => handleExport('hr')} disabled={!!exporting}>
            {exporting === 'hr' ? 'Đang xuất...' : <><Download size={16} /> HR</>}
          </Button>
          <Button variant="secondary" onClick={() => handleExport('sales')} disabled={!!exporting}>
            {exporting === 'sales' ? 'āang xuất...' : <><Download size={16} /> Sales</>}
          </Button>
          <Button variant="secondary" onClick={() => handleExport('inventory')} disabled={!!exporting}>
            {exporting === 'inventory' ? 'Đang xuất...' : <><Download size={16} /> Inventory</>}
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {loadingDashboard && Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-8 bg-slate-200 rounded w-1/2" />
            </div>
          </Card>
        ))}
        {!loadingDashboard && stats.map((s) => {
          const Icon = iconMap[s.icon] ?? UserCheck;
          return (
            <Card key={s.module} className="p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1 font-mono">
                    {s.amount != null && s.amount !== '0'
                      ? formatVND(s.amount)
                      : s.count}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {s.count} {s.label.toLowerCase()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Doanh thu theo tháng</h2>
            <TrendingUp size={20} className="text-slate-400" />
          </div>
          {loadingRevenue ? (
            <div className="animate-pulse h-[200px] bg-slate-200 rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="monthLabel" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip formatter={(v) => formatVND(v as number)} />
                <Legend />
                <Area type="monotone" dataKey="totalAmount" name="Tổng" stroke="#2563EB" fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="paidAmount" name="Đã thanh toán" stroke="#10B981" fill="url(#colorPaid)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Headcount Bar */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Nhân sự theo phòng ban</h2>
            <Users size={20} className="text-slate-400" />
          </div>
          {loadingHeadcount ? (
            <div className="animate-pulse h-[200px] bg-slate-200 rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={headcount}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="departmentCode" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="activeEmployees" name="Đang hoạt động" fill="#2563EB" />
                <Bar dataKey="employeeCount=" name="Tổng" fill="#94A3B8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Pie + Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Phân bố nhân sự</h2>
          {loadingHeadcount ? (
            <div className="animate-pulse h-[200px] bg-slate-200 rounded" />
          ) : pieData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Chưa có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Tồn kho theo sản phẩm</h2>
              <Badge tone="info">{inventory.length} bản ghi</Badge>
            </div>
            {loadingInventory ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded animate-pulse" />
                ))}
              </div>
            ) : inventory.length === 0 ? (
              <p className="p-8 text-sm text-slate-400 text-center">Chưa có dữ liệu tồn kho</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">SP</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Kho</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Nhập</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Xuất</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Tồn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.slice(0, 12).map((row) => (
                      <tr key={row.productId + row.warehouseName} className="hover:bg-primary-50">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-slate-500">{row.productCode}</span>
                          <span className="ml-2 text-slate-700">{row.productName}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{row.warehouseName}</td>
                        <td className="px-4 py-3 text-right text-green-600 font-mono">{formatVND(row.stockIn)}</td>
                        <td className="px-4 py-3 text-right text-red-600 font-mono">{formatVND(row.stockOut)}</td>
                        <td className="px-4 py-3 text-right font-mono text-slate-700">{formatVND(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {inventory.length > 12 && (
                  <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-200">
                    Hiển thị 12/{inventory.length} bản ghi. Xuất Excel để xem toàn bộ.
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
