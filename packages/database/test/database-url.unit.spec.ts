import { describe, expect, it } from 'vitest';

import { resolveDatabaseUrl } from '../src/database-url';

describe(resolveDatabaseUrl.name, () => {
  it('prefers direct URL over database URL', () => {
    expect(
      resolveDatabaseUrl({
        directUrl: 'postgresql://direct',
        databaseUrl: 'postgresql://pooled',
      }),
    ).toBe('postgresql://direct');
  });

  it('uses database URL before fallback URL', () => {
    expect(
      resolveDatabaseUrl({
        databaseUrl: 'postgresql://database',
        fallbackUrl: 'postgresql://fallback',
      }),
    ).toBe('postgresql://database');
  });

  it('throws a custom message when no URL is available', () => {
    expect(() =>
      resolveDatabaseUrl({
        errorMessage: 'Missing test database URL',
      }),
    ).toThrow('Missing test database URL');
  });
});
