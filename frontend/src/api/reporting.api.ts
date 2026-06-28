import { api } from './axios';

export interface DashboardStat {
  module: string;
  label: string;
  count: number;
  amount: string | number | null;
  icon: string;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  monthLabel: string;
  invoiceCount: number;
  totalAmount: string | number | null;
  paidAmount: string | number | null;
}

export interface HeadcountRow {
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  employeeCount: number;
  activeEmployees: number;
  totalSalary: number;
}

export interface InventoryTurnoverRow {
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  warehouseName: string;
  stockIn: string | number | null;
  stockOut: string | number | null;
  balance: string | number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStat[]>> {
  const { data } = await api.get('/reporting/dashboard');
  return data;
}

export async function getRevenueByMonth(year = 2026): Promise<ApiResponse<MonthlyRevenue[]>> {
  const { data } = await api.get('/reporting/revenue-by-month', { params: { year } });
  return data;
}

export async function getHeadcount(): Promise<ApiResponse<HeadcountRow[]>> {
  const { data } = await api.get('/reporting/headcount');
  return data;
}

export async function getInventoryTurnover(): Promise<ApiResponse<InventoryTurnoverRow[]>> {
  const { data } = await api.get('/reporting/inventory');
  return data;
}

export async function exportExcel(module: string): Promise<Blob> {
  const { data } = await api.get(`/reporting/export/${module}`, { responseType: 'blob' });
  return data;
}
