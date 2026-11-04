import { expect, test } from '../../src/fixtures/test.fixtures';

test('[AUTO-LOGIN-01] @smoke @regression logs in with valid credentials', async ({
  loginPage,
  header,
  registeredUser,
}) => {
  await loginPage.open();
  await loginPage.login(registeredUser.email, registeredUser.password);

  await expect.poll(() => loginPage.getUrl()).not.toContain('/login');
  await expect(header.accountLink).toHaveText(registeredUser.email);
  await expect(header.logoutLink).toBeVisible();
});

test('[AUTO-LOGIN-02] @regression rejects an incorrect password', async ({
  loginPage,
  header,
  registeredUser,
}) => {
  await loginPage.open();
  await loginPage.login(registeredUser.email, 'WrongPassword123!');

  await expect(loginPage.errorSummary).toContainText(
    'Login was unsuccessful. Please correct the errors and try again.',
  );
  await expect(loginPage.errorSummary).toContainText(
    'The credentials provided are incorrect',
  );
  expect(loginPage.getUrl()).toContain('/login');
  await expect(header.loginLink).toBeVisible();
  await expect(header.logoutLink).not.toBeVisible();
});
