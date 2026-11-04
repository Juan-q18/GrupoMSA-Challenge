import type { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly root: Locator;
  readonly registerLink: Locator;
  readonly loginLink: Locator;
  readonly cartLink: Locator;
  readonly cartQuantity: Locator;
  readonly logoutLink: Locator;
  readonly accountLink: Locator;

  constructor(page: Page) {
    this.root = page.locator('.header-links');
    this.registerLink = this.root.getByRole('link', { name: 'Register' });
    this.loginLink = this.root.getByRole('link', { name: 'Log in' });
    this.cartLink = this.root.getByRole('link', { name: /Shopping cart/ });
    this.cartQuantity = this.root.locator('.cart-qty');
    this.logoutLink = this.root.getByRole('link', { name: 'Log out' });
    this.accountLink = this.root.locator('a.account');
  }

  async openLogin(): Promise<void> {
    await this.loginLink.click();
  }

  async openRegister(): Promise<void> {
    await this.registerLink.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<number> {
    const text = (await this.cartQuantity.innerText()).trim();
    const match = /^\((\d+)\)$/.exec(text);

    if (!match?.[1]) {
      throw new Error(`Unexpected cart counter format: "${text}".`);
    }

    return Number.parseInt(match[1], 10);
  }

  async getAuthenticatedEmail(): Promise<string> {
    const email = (await this.accountLink.innerText()).trim();

    if (email.length === 0) {
      throw new Error('No authenticated account email is visible in the header.');
    }

    return email;
  }

  async isLoggedIn(): Promise<boolean> {
    return this.logoutLink.isVisible();
  }
}
