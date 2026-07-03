import { describe, expect, it } from 'vitest';
import { customerColumns } from '@/lib/columns/customer-columns';
import type { FilterFn, Row } from '@tanstack/react-table';
import type { Customer } from '@/types/customer';

const nameColumn = customerColumns.find((c) => c.id === 'name')!;
// filterFn's declared type is a union that also allows string presets
// (e.g. "auto") TypeScript can't rule out statically — this file's source
// defines it as a real function, so the cast is safe.
const nameFilterFn = nameColumn.filterFn as FilterFn<Customer>;

function fakeRow(overrides: Partial<Customer['user']> = {}): Row<Customer> {
  return {
    original: {
      id: 'cust_1',
      user: {
        id: 'user_1',
        email: 'ada@example.com',
        firstName: 'Ada',
        lastName: 'Lovelace',
        isVerified: true,
        ...overrides
      },
      createdAt: new Date()
    }
  } as Row<Customer>;
}

describe('customerColumns / name filterFn', () => {
  it('matches on first name, case-insensitively', () => {
    expect(nameFilterFn(fakeRow(), 'name', 'ada', () => {})).toBe(true);
  });

  it('matches on last name', () => {
    expect(nameFilterFn(fakeRow(), 'name', 'lovelace', () => {})).toBe(true);
  });

  it('does not match unrelated text', () => {
    expect(nameFilterFn(fakeRow(), 'name', 'grace', () => {})).toBe(false);
  });
});
