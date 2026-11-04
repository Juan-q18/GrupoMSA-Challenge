import type { APIResponse } from '@playwright/test';
import { ApiClient } from './api-client';

export interface DepartmentCategory {
  name: string;
  id?: string;
  permalink?: string;
  children_categories?: DepartmentCategory[];
}

export interface Department {
  name: string;
  categories: DepartmentCategory[];
}

export interface DepartmentsResponse {
  departments: Department[];
}

export class MercadoLibreClient extends ApiClient {
  async getDepartments(): Promise<APIResponse> {
    return this.get('/menu/departments', {
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
