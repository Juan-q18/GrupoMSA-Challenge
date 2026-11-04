import { laptop } from '../../src/data/products';
import { expect, test } from '../../src/fixtures/test.fixtures';
import { parsePrice } from '../../src/utils/price';

test('[AUTO-CART-01] @smoke @regression adds a product and verifies cart totals', async ({
  productPage,
  header,
  cartPage,
}) => {
  await productPage.open(laptop.slug);
  await productPage.setQuantity(1);
  await productPage.addToCart();

  await expect(productPage.notification).toContainText(
    'The product has been added to your shopping cart',
  );
  await expect(header.cartLink).toContainText('(1)');

  await cartPage.open();
  await expect(cartPage.getProductRow(laptop.name)).toBeVisible();

  const unitPrice = await cartPage.getProductPrice(laptop.name);
  expect(await cartPage.getQuantity(laptop.name)).toBe(1);
  expect(await cartPage.getLineTotal(laptop.name)).toBe(unitPrice);
  expect(parsePrice(await cartPage.getSubTotal())).toBe(unitPrice);
  expect(parsePrice(await cartPage.getTotal())).toBe(unitPrice);
});

test('[AUTO-CART-02] @regression updates quantity and recalculates totals', async ({
  productPage,
  header,
  cartPage,
}) => {
  await productPage.open(laptop.slug);
  await productPage.setQuantity(1);
  await productPage.addToCart();
  await expect(header.cartLink).toContainText('(1)');

  await cartPage.open();
  const unitPrice = await cartPage.getProductPrice(laptop.name);

  await cartPage.updateQuantity(laptop.name, 2);
  await expect(header.cartLink).toContainText('(2)');

  const expectedLineTotal = Number((unitPrice * 2).toFixed(2));
  expect(await cartPage.getQuantity(laptop.name)).toBe(2);
  expect(await cartPage.getLineTotal(laptop.name)).toBe(expectedLineTotal);
  expect(parsePrice(await cartPage.getSubTotal())).toBe(expectedLineTotal);
  expect(parsePrice(await cartPage.getTotal())).toBe(expectedLineTotal);
});
