import { api } from './axios';

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  active: boolean;
  roles: Role[];
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

export async function getUsers(params: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<PageResponse<User>>> {
  const { data } = await api.get<ApiResponse<PageResponse<User>>>('/v1/admin/users', {
    params,
  });
  return data;
}

export async function getUser(id: string): Promise<ApiResponse<User>> {
  const { data } = await api.get<ApiResponse<User>>(`/v1/admin/users/${id}`);
  return data;
}

export async function createUser(payload: Partial<User> & { password?: string }) {
  const { data } = await api.post<ApiResponse<User>>('/v1/admin/users', payload);
  return data;
}

export async function updateUser(id: string, payload: Partial<User>) {
  const { data } = await api.put<ApiResponse<User>>(`/v1/admin/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete<ApiResponse<void>>(`/v1/admin/users/${id}`);
  return data;
}

export async function assignRoles(userId: string, roleIds: string[]) {
  const { data } = await api.post<ApiResponse<User>>(
    `/v1/admin/users/${userId}/roles`,
    { roleIds },
  );
  return data;
}

export async function getRoles(params: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<PageResponse<Role>>> {
  const { data } = await api.get<ApiResponse<PageResponse<Role>>>('/v1/admin/roles', {
    params,
  });
  return data;
}

export async function getAllRoles(): Promise<ApiResponse<Role[]>> {
  const { data } = await api.get<ApiResponse<PageResponse<Role>>>('/v1/admin/roles', {
    params: { size: 200 },
  });
  return { ...data, data: data.data.content };
}

export async function createRole(payload: Partial<Role>) {
  const { data } = await api.post<ApiResponse<Role>>('/v1/admin/roles', payload);
  return data;
}

export async function updateRole(id: string, payload: Partial<Role>) {
  const { data } = await api.put<ApiResponse<Role>>(`/v1/admin/roles/${id}`, payload);
  return data;
}

export async function deleteRole(id: string) {
  const { data } = await api.delete<ApiResponse<void>>(`/v1/admin/roles/${id}`);
  return data;
}
