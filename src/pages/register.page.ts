import type { Locator, Page } from '@playwright/test';
import type { TestUser } from '../data/user.factory';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly validationErrors: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByLabel('First name:');
    this.lastNameInput = page.getByLabel('Last name:');
    this.emailInput = page.getByLabel('Email:');
    this.passwordInput = page.getByLabel('Password:', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm password:');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.validationErrors = page.locator('.field-validation-error');
  }

  async open(): Promise<void> {
    await this.goto('/register');
  }

  async register(user: TestUser): Promise<void> {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.password);
    await this.registerButton.click();
  }

  async getValidationMessages(): Promise<string[]> {
    const messages = await this.validationErrors.allInnerTexts();
    return messages.map((message) => message.trim());
  }
}
