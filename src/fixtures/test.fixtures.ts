import { test as base, expect } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { createTestUser, type UserFactory } from '../data/user.factory';
import { CartPage } from '../pages/cart.page';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

interface FrameworkFixtures {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  cartPage: CartPage;
  header: HeaderComponent;
  userFactory: UserFactory;
}

export const test = base.extend<FrameworkFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  userFactory: async ({}, use) => {
    await use(createTestUser);
  },
});

export { expect };
