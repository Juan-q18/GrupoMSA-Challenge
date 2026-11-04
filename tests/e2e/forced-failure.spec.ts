import { expect, test } from '../../src/fixtures/test.fixtures';

test('[AUTO-FF-01] @forced-failure forces a deterministic failure to validate screenshots', async ({
  homePage,
  header,
}) => {
  await homePage.open();
  await expect(header.cartLink).toContainText('(99)');
});
