import { describe, expect, it } from 'vitest';

import { createRedisCacheStore } from '../src';

const redisUrl = process.env['REDIS_URL'];
const describeIfRedis = redisUrl ? describe : describe.skip;

describeIfRedis('RedisCacheStore integration', () => {
  it('stores, reads, and deletes values by prefix', async () => {
    const managedStore = createRedisCacheStore({
      keyPrefix: `g-scores-cache-test-${Date.now()}`,
      url: redisUrl as string,
    });
    const store = managedStore.store;

    try {
      await store.set('reports:a', { count: 1 }, 60);
      await store.set('reports:b', { count: 2 }, 60);
      await store.set('catalogs:a', { count: 3 }, 60);

      await expect(store.get('reports:a')).resolves.toEqual({ count: 1 });

      await store.deleteByPrefix('reports:');

      await expect(store.get('reports:a')).resolves.toBeNull();
      await expect(store.get('reports:b')).resolves.toBeNull();
      await expect(store.get('catalogs:a')).resolves.toEqual({ count: 3 });
    } finally {
      await store.clear();
      await managedStore.close();
    }
  });
});
