import { describe, expect, it } from 'vitest';

import { MemoryCacheStore } from '../src';

describe(MemoryCacheStore.name, () => {
  it('reads and deletes values', async () => {
    const store = new MemoryCacheStore();

    await store.set('catalogs:subjects', [{ code: 'toan' }], 60);
    await expect(store.get('catalogs:subjects')).resolves.toEqual([{ code: 'toan' }]);

    await store.delete('catalogs:subjects');
    await expect(store.get('catalogs:subjects')).resolves.toBeNull();
  });

  it('deletes values by prefix', async () => {
    const store = new MemoryCacheStore();

    await store.set('reports:a', 1, 60);
    await store.set('reports:b', 2, 60);
    await store.set('catalogs:a', 3, 60);

    await store.deleteByPrefix('reports:');

    await expect(store.get('reports:a')).resolves.toBeNull();
    await expect(store.get('reports:b')).resolves.toBeNull();
    await expect(store.get('catalogs:a')).resolves.toBe(3);
  });
});
