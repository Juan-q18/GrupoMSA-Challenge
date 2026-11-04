import { expect, test } from '@playwright/test';
import { ShopClient, type AddToCartResponse } from '../../src/api/shop.client';
import { env } from '../../src/config/env';
import { stripHtml } from '../../src/utils/html';

test('[API-SHOP-01] POST addproducttocart returns success and cart confirmation', async ({
  request,
}) => {
  const client = new ShopClient(request, env.baseUrl);
  const response = await client.addProductToCart();

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = (await response.json()) as AddToCartResponse;

  expect(body.success).toBe(true);
  expect(stripHtml(body.message)).toContain(
    'The product has been added to your shopping cart',
  );
  expect(body.updatetopcartsectionhtml).toContain('(1)');

  const flyout = stripHtml(body.updateflyoutcartsectionhtml);
  expect(flyout).toContain('14.1-inch Laptop');
  expect(flyout).toContain('Quantity: 1');
});
