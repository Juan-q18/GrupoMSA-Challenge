import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  readonly root: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly notification: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.locator('.product-essential');
    this.addToCartButton = this.root.getByRole('button', { name: 'Add to cart' });
    this.quantityInput = this.root.locator('input.qty-input');
    this.notification = page.locator('.bar-notification');
  }

  async open(slug: string): Promise<void> {
    await this.goto(`/${slug}`);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async setQuantity(qty: number): Promise<void> {
    await this.quantityInput.fill(String(qty));
  }

  async getNotificationText(): Promise<string> {
    return (await this.notification.innerText()).trim();
  }
}
