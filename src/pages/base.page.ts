import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    await this.page.goto(normalizedPath);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  getUrl(): string {
    return this.page.url();
  }
}
