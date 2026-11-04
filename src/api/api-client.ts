import type { APIRequestContext, APIResponse } from '@playwright/test';

export type ApiGetOptions = NonNullable<Parameters<APIRequestContext['get']>[1]>;
export type ApiPostOptions = NonNullable<Parameters<APIRequestContext['post']>[1]>;

export class ApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async get(path: string, options?: ApiGetOptions): Promise<APIResponse> {
    return this.request.get(this.buildUrl(path), options);
  }

  async post(path: string, options?: ApiPostOptions): Promise<APIResponse> {
    return this.request.post(this.buildUrl(path), options);
  }

  private buildUrl(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }
}
