import { api } from './axios';

export interface Customer {
  id: string;
  code: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
}

export interface SalesOrderLineDto {
  id?: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  status: string;
  description?: string;
  lines: SalesOrderLineDto[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  salesOrderId?: string;
  salesOrderNumber?: string;
  invoiceDate: string;
  status: string;
  totalAmount: number;
  description?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function getCustomers(params: {
  page?: number;
  size?: number;
  keyword?: string;
} = {}): Promise<ApiResponse<PageResponse<Customer>>> {
  const { data } = await api.get('/sales/customers', { params });
  return data;
}

export async function createCustomer(payload: Partial<Customer>) {
  const { data } = await api.post<ApiResponse<Customer>>('/sales/customers', payload);
  return data;
}

export async function updateCustomer(id: string, payload: Partial<Customer>) {
  const { data } = await api.put<ApiResponse<Customer>>(`/sales/customers/${id}`, payload);
  return data;
}

export async function deleteCustomer(id: string) {
  const { data } = await api.delete(`/sales/customers/${id}`);
  return data;
}

export async function getSalesOrders(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<SalesOrder>>> {
  const { data } = await api.get('/sales/sales-orders', { params });
  return data;
}

export async function getSalesOrder(id: string): Promise<ApiResponse<SalesOrder>> {
  const { data } = await api.get(`/sales/sales-orders/${id}`);
  return data;
}

export async function createSalesOrder(payload: Partial<SalesOrder>) {
  const { data } = await api.post<ApiResponse<SalesOrder>>('/sales/sales-orders', payload);
  return data;
}

export async function getInvoices(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<Invoice>>> {
  const { data } = await api.get('/sales/invoices', { params });
  return data;
}

export async function getInvoice(id: string): Promise<ApiResponse<Invoice>> {
  const { data } = await api.get(`/sales/invoices/${id}`);
  return data;
}

export async function createInvoice(payload: Partial<Invoice>) {
  const { data } = await api.post<ApiResponse<Invoice>>('/sales/invoices', payload);
  return data;
}
