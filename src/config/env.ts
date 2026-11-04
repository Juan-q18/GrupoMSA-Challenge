import { URL } from 'node:url';

const DEFAULT_BASE_URL = 'https://demowebshop.tricentis.com';
const DEFAULT_ML_BASE_URL = 'https://www.mercadolibre.com.ar';

export interface EnvConfig {
  baseUrl: string;
  mlBaseUrl: string;
  testUserEmail?: string;
  testUserPassword?: string;
}

function parseHttpUrl(name: string, rawValue: string): string {
  const value = rawValue.trim();

  if (value.length === 0) {
    throw new Error(`${name} is empty. Provide an absolute http(s) URL.`);
  }

  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${name} is not a valid URL: "${value}".`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`${name} must use http or https: "${value}".`);
  }

  return parsed.toString().replace(/\/$/, '');
}

export const env: EnvConfig = {
  baseUrl: parseHttpUrl(
    'BASE_URL',
    process.env.BASE_URL?.trim() || DEFAULT_BASE_URL,
  ),
  mlBaseUrl: parseHttpUrl(
    'ML_BASE_URL',
    process.env.ML_BASE_URL?.trim() || DEFAULT_ML_BASE_URL,
  ),
  testUserEmail: process.env.TEST_USER_EMAIL?.trim() || undefined,
  testUserPassword: process.env.TEST_USER_PASSWORD || undefined,
};
