import { expect, test } from '../../src/fixtures/test.fixtures';

test('framework sanity: home page exposes title and empty cart counter', async ({ homePage, header }) => {
  await homePage.open();

  expect(await homePage.getTitle()).toBe('Demo Web Shop');
  expect(await header.getCartCount()).toBe(0);
  await expect(header.cartLink).toContainText('(0)');
});
