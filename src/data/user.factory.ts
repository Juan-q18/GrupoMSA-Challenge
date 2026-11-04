import { randomString } from '../utils/random';

export interface TestUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type UserFactory = (overrides?: Partial<TestUser>) => TestUser;

export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const timestamp = Date.now();
  const random = randomString(8);

  return {
    firstName: 'QA',
    lastName: 'Automation',
    email: `qa.${timestamp}.${random}@example.com`,
    password: `Qa!${randomString(10)}`,
    ...overrides,
  };
}
