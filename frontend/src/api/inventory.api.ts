import { api } from './axios';

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  unit?: string;
  unitPrice?: number;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  description?: string;
  address?: string;
}

export interface StockMove {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  warehouseId: string;
  warehouseName: string;
  moveType: string;
  quantity: number;
  note?: string;
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

export async function getProducts(params: {
  page?: number;
  size?: number;
  keyword?: string;
} = {}): Promise<ApiResponse<PageResponse<Product>>> {
  const { data } = await api.get('/v1/inventory/products', { params });
  return data;
}

export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  const { data } = await api.get(`/v1/inventory/products/${id}`);
  return data;
}

export async function createProduct(payload: Partial<Product>) {
  const { data } = await api.post<ApiResponse<Product>>('/v1/inventory/products', payload);
  return data;
}

export async function updateProduct(id: string, payload: Partial<Product>) {
  const { data } = await api.put<ApiResponse<Product>>(`/v1/inventory/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string) {
  const { data } = await api.delete(`/v1/inventory/products/${id}`);
  return data;
}

export async function getWarehouses(params: {
  page?: number;
  size?: number;
  keyword?: string;
} = {}): Promise<ApiResponse<PageResponse<Warehouse>>> {
  const { data } = await api.get('/v1/inventory/warehouses', { params });
  return data;
}

export async function createWarehouse(payload: Partial<Warehouse>) {
  const { data } = await api.post<ApiResponse<Warehouse>>('/v1/inventory/warehouses', payload);
  return data;
}

export async function updateWarehouse(id: string, payload: Partial<Warehouse>) {
  const { data } = await api.put<ApiResponse<Warehouse>>(`/v1/inventory/warehouses/${id}`, payload);
  return data;
}

export async function deleteWarehouse(id: string) {
  const { data } = await api.delete(`/v1/inventory/warehouses/${id}`);
  return data;
}

export async function getStockMoves(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<StockMove>>> {
  const { data } = await api.get('/v1/inventory/stock-moves', { params });
  return data;
}

export async function createStockMove(payload: Partial<StockMove>) {
  const { data } = await api.post<ApiResponse<StockMove>>('/v1/inventory/stock-moves', payload);
  return data;
}
