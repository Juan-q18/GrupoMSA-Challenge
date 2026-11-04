import type { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/price';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly updateCartButton: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.updateCartButton = page.getByRole('button', { name: 'Update shopping cart' });
    this.emptyMessage = page.getByText('Your Shopping Cart is empty!');
  }

  async open(): Promise<void> {
    await this.goto('/cart');
  }

  getProductRow(productName: string): Locator {
    return this.page.locator('tr.cart-item-row').filter({ hasText: productName });
  }

  async updateQuantity(productName: string, qty: number): Promise<void> {
    const row = this.getProductRow(productName);
    await row.locator('input.qty-input').fill(String(qty));
    await this.updateCartButton.click();
  }

  async removeProduct(productName: string): Promise<void> {
    const row = this.getProductRow(productName);
    await row.getByRole('checkbox').check();
    await this.updateCartButton.click();
  }

  async getSubTotal(): Promise<string> {
    const row = this.page.locator('.cart-total tr').filter({ hasText: 'Sub-Total:' });
    return this.getSummaryValue(row);
  }

  async getProductPrice(productName: string): Promise<number> {
    const row = this.getProductRow(productName);
    return parsePrice(await row.locator('.product-unit-price').innerText());
  }

  async getLineTotal(productName: string): Promise<number> {
    const row = this.getProductRow(productName);
    return parsePrice(await row.locator('.product-subtotal').innerText());
  }

  async getQuantity(productName: string): Promise<number> {
    const row = this.getProductRow(productName);
    const value = await row.locator('input.qty-input').inputValue();
    const quantity = Number.parseInt(value, 10);

    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error(`Unexpected quantity "${value}" for product "${productName}".`);
    }

    return quantity;
  }

  async getTotal(): Promise<string> {
    const row = this.page
      .locator('.cart-total tr')
      .filter({ has: this.page.locator('.order-total') });
    return this.getSummaryValue(row);
  }

  async getEmptyMessage(): Promise<string> {
    return (await this.emptyMessage.innerText()).trim();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyMessage.isVisible();
  }

  private async getSummaryValue(row: Locator): Promise<string> {
    const value = await row.locator('.cart-total-right').innerText();
    return value.trim();
  }
}
