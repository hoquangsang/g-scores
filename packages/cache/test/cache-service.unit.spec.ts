import { describe, expect, it, vi } from 'vitest';

import { CacheService, MemoryCacheStore } from '../src';

describe(CacheService.name, () => {
  it('stores factory result on cache miss', async () => {
    const service = new CacheService(new MemoryCacheStore(), { defaultTtlSeconds: 60 });
    const factory = vi.fn().mockResolvedValue({ value: 1 });

    await expect(service.remember('key', factory)).resolves.toEqual({ value: 1 });
    await expect(service.remember('key', factory)).resolves.toEqual({ value: 1 });

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('does not cache failed factory calls', async () => {
    const service = new CacheService(new MemoryCacheStore(), { defaultTtlSeconds: 60 });
    const factory = vi.fn().mockRejectedValue(new Error('failed'));

    await expect(service.remember('key', factory)).rejects.toThrow('failed');
    await expect(service.remember('key', factory)).rejects.toThrow('failed');

    expect(factory).toHaveBeenCalledTimes(2);
  });
});
