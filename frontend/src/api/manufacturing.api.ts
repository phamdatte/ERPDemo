import { api } from './axios';

export interface BomLineDto {
  id?: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
}

export interface BillOfMaterial {
  id: string;
  code: string;
  productId: string;
  productName: string;
  description?: string;
  lines: BomLineDto[];
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  bomId?: string;
  bomCode?: string;
  warehouseId?: string;
  warehouseName?: string;
  quantity: number;
  startDate?: string;
  endDate?: string;
  status: string;
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

export async function getBillOfMaterials(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<BillOfMaterial>>> {
  const { data } = await api.get('/manufacturing/boms', { params });
  return data;
}

export async function getBillOfMaterial(id: string): Promise<ApiResponse<BillOfMaterial>> {
  const { data } = await api.get(`/manufacturing/boms/${id}`);
  return data;
}

export async function createBillOfMaterial(payload: Partial<BillOfMaterial>) {
  const { data } = await api.post<ApiResponse<BillOfMaterial>>('/manufacturing/boms', payload);
  return data;
}

export async function getWorkOrders(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<WorkOrder>>> {
  const { data } = await api.get('/manufacturing/work-orders', { params });
  return data;
}

export async function getWorkOrder(id: string): Promise<ApiResponse<WorkOrder>> {
  const { data } = await api.get(`/manufacturing/work-orders/${id}`);
  return data;
}

export async function createWorkOrder(payload: Partial<WorkOrder>) {
  const { data } = await api.post<ApiResponse<WorkOrder>>('/manufacturing/work-orders', payload);
  return data;
}
