import { faker } from '@faker-js/faker';

// User data
export interface GeneratedUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export function generateUser(overrides?: Partial<GeneratedUser>): GeneratedUser {
  return {
    email: `e2e-test-${faker.string.alphanumeric(8)}@loyalix.test`.toLowerCase(),
    password: 'TestPass123!@#',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number('+1##########'),
    ...overrides,
  };
}

// Business data
export interface GeneratedBusiness {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

export function generateBusiness(overrides?: Partial<GeneratedBusiness>): GeneratedBusiness {
  return {
    name: `E2E Test ${faker.company.name()}`,
    description: faker.company.catchPhrase(),
    email: `e2e-test-${faker.string.alphanumeric(8)}@business.test`.toLowerCase(),
    phone: faker.phone.number('+1##########'),
    address: faker.location.streetAddress(),
    ...overrides,
  };
}

// Customer data
export interface GeneratedCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function generateCustomer(overrides?: Partial<GeneratedCustomer>): GeneratedCustomer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `e2e-test-${faker.string.alphanumeric(8)}@customer.test`.toLowerCase(),
    phone: faker.phone.number('+1##########'),
    ...overrides,
  };
}

// Loyalty Program data
export interface GeneratedLoyaltyProgram {
  name: string;
  description: string;
  pointsPerDollar: number;
  minPurchaseAmount: number;
}

export function generateLoyaltyProgram(overrides?: Partial<GeneratedLoyaltyProgram>): GeneratedLoyaltyProgram {
  return {
    name: `E2E ${faker.word.adjective()} Rewards`,
    description: faker.lorem.sentence(),
    pointsPerDollar: faker.number.int({ min: 1, max: 10 }),
    minPurchaseAmount: faker.number.int({ min: 1, max: 100 }),
    ...overrides,
  };
}

// Reward data
export interface GeneratedReward {
  name: string;
  description: string;
  pointsRequired: number;
}

export function generateReward(overrides?: Partial<GeneratedReward>): GeneratedReward {
  return {
    name: `E2E ${faker.commerce.productName()}`,
    description: faker.commerce.productDescription(),
    pointsRequired: faker.number.int({ min: 50, max: 500 }),
    ...overrides,
  };
}

// Role data
export interface GeneratedRole {
  name: string;
  description: string;
}

export function generateRole(overrides?: Partial<GeneratedRole>): GeneratedRole {
  return {
    name: `E2E_ROLE_${faker.string.alphanumeric(6).toUpperCase()}`,
    description: faker.lorem.sentence(),
    ...overrides,
  };
}

// Promotion data
export interface GeneratedPromotion {
  name: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
}

export function generatePromotion(overrides?: Partial<GeneratedPromotion>): GeneratedPromotion {
  const startDate = faker.date.soon({ days: 1 });
  const endDate = faker.date.soon({ days: 30, refDate: startDate });

  return {
    name: `E2E ${faker.commerce.productAdjective()} Promo`,
    description: faker.lorem.sentence(),
    discountPercent: faker.number.int({ min: 5, max: 50 }),
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    ...overrides,
  };
}

// Simple type data (for BusinessType, RewardType, RuleType, EventType)
export interface GeneratedSimpleType {
  name: string;
  description: string;
}

export function generateSimpleType(prefix: string, overrides?: Partial<GeneratedSimpleType>): GeneratedSimpleType {
  return {
    name: `E2E ${prefix} ${faker.word.noun()}`,
    description: faker.lorem.sentence(),
    ...overrides,
  };
}

// Utility functions
export function generateTestId(): string {
  return `e2e-${Date.now()}-${faker.string.alphanumeric(6)}`;
}

export function generateTestEmail(prefix = 'e2e-test'): string {
  return `${prefix}-${faker.string.alphanumeric(8)}@loyalix.test`.toLowerCase();
}

export function isTestData(identifier: string): boolean {
  return identifier.toLowerCase().includes('e2e') || identifier.toLowerCase().includes('test');
}
