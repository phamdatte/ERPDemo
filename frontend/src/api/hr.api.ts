import { api } from './axios';

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  managerId?: string;
  managerName?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  hireDate: string;
  status: string;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  baseSalary?: number;
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

export async function getDepartments(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<Department>>> {
  const { data } = await api.get('/v1/hr/departments', { params });
  return data;
}

export async function createDepartment(payload: Partial<Department>) {
  const { data } = await api.post<ApiResponse<Department>>('/v1/hr/departments', payload);
  return data;
}

export async function updateDepartment(id: string, payload: Partial<Department>) {
  const { data } = await api.put<ApiResponse<Department>>(`/v1/hr/departments/${id}`, payload);
  return data;
}

export async function deleteDepartment(id: string) {
  const { data } = await api.delete(`/v1/hr/departments/${id}`);
  return data;
}

export async function getEmployees(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<Employee>>> {
  const { data } = await api.get('/v1/hr/employees', { params });
  return data;
}

export async function getEmployee(id: string): Promise<ApiResponse<Employee>> {
  const { data } = await api.get(`/v1/hr/employees/${id}`);
  return data;
}

export async function createEmployee(payload: Partial<Employee>) {
  const { data } = await api.post<ApiResponse<Employee>>('/v1/hr/employees', payload);
  return data;
}

export async function updateEmployee(id: string, payload: Partial<Employee>) {
  const { data } = await api.put<ApiResponse<Employee>>(`/v1/hr/employees/${id}`, payload);
  return data;
}

export async function deleteEmployee(id: string) {
  const { data } = await api.delete(`/v1/hr/employees/${id}`);
  return data;
}
