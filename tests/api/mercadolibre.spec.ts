import { expect, test } from '@playwright/test';
import {
  MercadoLibreClient,
  type DepartmentsResponse,
} from '../../src/api/mercadolibre.client';
import { env } from '../../src/config/env';

test('[API-ML-01] GET /menu/departments returns departments with name and categories', async ({
  request,
}) => {
  const client = new MercadoLibreClient(request, env.mlBaseUrl);
  const response = await client.getDepartments();

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = (await response.json()) as DepartmentsResponse;

  expect(Array.isArray(body.departments)).toBe(true);
  expect(body.departments.length).toBeGreaterThan(0);

  for (const department of body.departments) {
    expect(typeof department.name).toBe('string');
    expect(department.name.trim().length).toBeGreaterThan(0);
    expect(Array.isArray(department.categories)).toBe(true);

    for (const category of department.categories) {
      expect(typeof category.name).toBe('string');
      expect(category.name.trim().length).toBeGreaterThan(0);
    }
  }
});
