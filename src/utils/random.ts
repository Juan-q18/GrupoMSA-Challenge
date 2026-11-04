import { randomBytes } from 'node:crypto';

export function randomString(length: number): string {
  if (!Number.isInteger(length) || length < 1) {
    throw new Error('randomString length must be a positive integer.');
  }

  return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
