import { api } from './axios';

export interface Vendor {
  id: string;
  code: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface PurchaseOrderLineDto {
  id?: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  status: string;
  description?: string;
  lines: PurchaseOrderLineDto[];
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

export async function getVendors(params: {
  page?: number;
  size?: number;
  keyword?: string;
} = {}): Promise<ApiResponse<PageResponse<Vendor>>> {
  const { data } = await api.get('/v1/procurement/vendors', { params });
  return data;
}

export async function createVendor(payload: Partial<Vendor>) {
  const { data } = await api.post<ApiResponse<Vendor>>('/v1/procurement/vendors', payload);
  return data;
}

export async function updateVendor(id: string, payload: Partial<Vendor>) {
  const { data } = await api.put<ApiResponse<Vendor>>(`/v1/procurement/vendors/${id}`, payload);
  return data;
}

export async function deleteVendor(id: string) {
  const { data } = await api.delete(`/v1/procurement/vendors/${id}`);
  return data;
}

export async function getPurchaseOrders(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<PurchaseOrder>>> {
  const { data } = await api.get('/v1/procurement/purchase-orders', { params });
  return data;
}

export async function getPurchaseOrder(id: string): Promise<ApiResponse<PurchaseOrder>> {
  const { data } = await api.get(`/v1/procurement/purchase-orders/${id}`);
  return data;
}

export async function createPurchaseOrder(payload: Partial<PurchaseOrder>) {
  const { data } = await api.post<ApiResponse<PurchaseOrder>>('/v1/procurement/purchase-orders', payload);
  return data;
}
