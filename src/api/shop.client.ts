import type { APIResponse } from '@playwright/test';
import { ApiClient } from './api-client';

export interface AddToCartResponse {
  success: boolean;
  message: string;
  updatetopcartsectionhtml: string;
  updateflyoutcartsectionhtml: string;
}

export class ShopClient extends ApiClient {
  async addProductToCart(productId = 31, quantity = 1): Promise<APIResponse> {
    return this.post(`/addproducttocart/details/${productId}/${quantity}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: `${this.baseUrl}/141-inch-laptop`,
        Accept: '*/*',
      },
      form: {
        [`addtocart_${productId}.EnteredQuantity`]: String(quantity),
      },
    });
  }
}
