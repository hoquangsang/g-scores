import { describe, expect, it } from 'vitest';

import { NoopCacheStore } from '../src';

describe(NoopCacheStore.name, () => {
  it('always misses', async () => {
    const store = new NoopCacheStore();

    await store.set('key', 'value', 60);

    await expect(store.get('key')).resolves.toBeNull();
  });
});
