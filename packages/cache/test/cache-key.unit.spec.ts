import { describe, expect, it } from 'vitest';

import { createCacheKey } from '../src';

describe(createCacheKey.name, () => {
  it('creates a stable key from meaningful parts', () => {
    expect(createCacheKey('reports', 'top-group', 'A', 10)).toBe('reports:top-group:A:10');
  });

  it('ignores empty, null, and undefined parts', () => {
    expect(createCacheKey('reports', '', null, undefined, 'all')).toBe('reports:all');
  });
});
