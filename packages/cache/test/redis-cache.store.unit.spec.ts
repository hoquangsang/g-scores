import { describe, expect, it, vi } from 'vitest';
import type { Redis } from 'ioredis';

import { RedisCacheStore } from '../src';

describe(RedisCacheStore.name, () => {
  it('returns cache miss when Redis read fails', async () => {
    const logger = {
      warn: vi.fn(),
    };
    const store = new RedisCacheStore(
      {
        get: vi.fn().mockRejectedValue(new Error('redis unavailable')),
        status: 'ready',
      } as unknown as Redis,
      { logger },
    );

    await expect(store.get('key')).resolves.toBeNull();
    expect(logger.warn).toHaveBeenCalledWith('Failed to read cache key "key"', expect.any(Error));
  });

  it('does not throw when Redis write fails', async () => {
    const logger = {
      warn: vi.fn(),
    };
    const store = new RedisCacheStore(
      {
        set: vi.fn().mockRejectedValue(new Error('redis unavailable')),
        status: 'ready',
      } as unknown as Redis,
      { logger },
    );

    await expect(store.set('key', { value: 1 }, 60)).resolves.toBeUndefined();
  });

  it('waits for an in-flight Redis connection before sending commands', async () => {
    const client = {
      connect: vi.fn(),
      get: vi.fn().mockResolvedValue(JSON.stringify({ value: 1 })),
      status: 'wait',
    };
    let resolveConnection: (() => void) | undefined;

    client.connect.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveConnection = () => {
            client.status = 'ready';
            resolve();
          };
        }),
    );

    const store = new RedisCacheStore(client as unknown as Redis);
    const firstRead = store.get('key');
    const secondRead = store.get('key');

    expect(client.connect).toHaveBeenCalledTimes(1);

    resolveConnection?.();

    await expect(firstRead).resolves.toEqual({ value: 1 });
    await expect(secondRead).resolves.toEqual({ value: 1 });
    expect(client.get).toHaveBeenCalledTimes(2);
  });
});
