import { test as base, expect } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { createTestUser, type TestUser, type UserFactory } from '../data/user.factory';
import { CartPage } from '../pages/cart.page';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { RegisterPage } from '../pages/register.page';

interface FrameworkFixtures {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  cartPage: CartPage;
  productPage: ProductPage;
  header: HeaderComponent;
  userFactory: UserFactory;
  registeredUser: TestUser;
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
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  userFactory: async ({}, use) => {
    await use(createTestUser);
  },
  registeredUser: async ({ page, registerPage, header, userFactory }, use) => {
    const user = userFactory();

    await registerPage.open();
    await registerPage.register(user);
    await page.waitForURL(/\/registerresult/);

    await header.logout();
    await header.loginLink.waitFor({ state: 'visible' });

    await use(user);
  },
});

export { expect };
