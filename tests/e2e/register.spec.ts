import { expect, test } from '../../src/fixtures/test.fixtures';

test('[AUTO-REG-01] @smoke @regression registers a new user with unique data', async ({
  registerPage,
  header,
  userFactory,
}) => {
  const user = userFactory();

  await registerPage.open();
  await registerPage.register(user);

  await expect.poll(() => registerPage.getUrl()).toContain('/registerresult');
  await expect(registerPage.resultMessage).toHaveText('Your registration completed');
  await expect(header.accountLink).toHaveText(user.email);
  await expect(header.logoutLink).toBeVisible();
});

test('[AUTO-REG-02] @regression validates required fields and email/password rules', async ({
  registerPage,
}) => {
  await registerPage.open();
  await registerPage.registerButton.click();
  await expect(registerPage.validationErrors.first()).toBeVisible();

  const requiredMessages = await registerPage.getValidationMessages();
  expect(requiredMessages).toEqual(
    expect.arrayContaining([
      'First name is required.',
      'Last name is required.',
      'Email is required.',
      'Password is required.',
    ]),
  );

  await registerPage.firstNameInput.fill('QA');
  await registerPage.lastNameInput.fill('Automation');
  await registerPage.emailInput.fill('not-an-email');
  await registerPage.passwordInput.fill('Password123!');
  await registerPage.confirmPasswordInput.fill('Different123!');
  await registerPage.registerButton.click();
  await expect(registerPage.validationErrors.first()).toBeVisible();

  const invalidMessages = await registerPage.getValidationMessages();
  expect(invalidMessages).toEqual(
    expect.arrayContaining([
      'Wrong email',
      'The password and confirmation password do not match.',
    ]),
  );
  expect(registerPage.getUrl()).not.toContain('/registerresult');
});
