import { api } from './axios';

export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  type: string;
  description?: string;
  parentId?: string;
  parentName?: string;
}

export interface JournalLine {
  id?: string;
  accountId: string;
  accountCode?: string;
  accountName?: string;
  description?: string;
  debit?: number;
  credit?: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  description?: string;
  reference?: string;
  totalDebit: number;
  totalCredit: number;
  lines: JournalLine[];
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

export async function getAccounts(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<ChartOfAccount>>> {
  const { data } = await api.get('/v1/accounting/accounts', { params });
  return data;
}

export async function createAccount(payload: Partial<ChartOfAccount>) {
  const { data } = await api.post<ApiResponse<ChartOfAccount>>('/v1/accounting/accounts', payload);
  return data;
}

export async function deleteAccount(id: string) {
  const { data } = await api.delete(`/v1/accounting/accounts/${id}`);
  return data;
}

export async function getJournalEntries(params: {
  page?: number;
  size?: number;
} = {}): Promise<ApiResponse<PageResponse<JournalEntry>>> {
  const { data } = await api.get('/v1/accounting/journal-entries', { params });
  return data;
}

export async function createJournalEntry(payload: {
  entryNumber: string;
  entryDate: string;
  description?: string;
  reference?: string;
  lines: JournalLine[];
}) {
  const { data } = await api.post<ApiResponse<JournalEntry>>('/v1/accounting/journal-entries', payload);
  return data;
}
