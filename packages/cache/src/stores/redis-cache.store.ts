import Redis from 'ioredis';
import type { Redis as RedisClient } from 'ioredis';

import type { CacheLogger, CacheStore } from '../cache-store';

export type RedisCacheStoreOptions = {
  keyPrefix?: string;
  logger?: CacheLogger;
};

export type CreateRedisCacheStoreOptions = RedisCacheStoreOptions & {
  url: string;
};

export type ManagedRedisCacheStore = {
  close(): Promise<void>;
  store: RedisCacheStore;
};

const noopLogger: CacheLogger = {
  warn() {
    return undefined;
  },
};

export class RedisCacheStore implements CacheStore {
  private connectPromise: Promise<void> | null = null;
  private readonly client: RedisClient;
  private readonly keyPrefix: string;
  private readonly logger: CacheLogger;

  constructor(client: RedisClient, options: RedisCacheStoreOptions = {}) {
    this.client = client;
    this.keyPrefix = options.keyPrefix?.trim() ?? '';
    this.logger = options.logger ?? noopLogger;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      await this.ensureConnected();
      const value = await this.client.get(this.buildKey(key));

      if (value === null) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.warn(`Failed to read cache key "${key}"`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (ttlSeconds <= 0) {
      return;
    }

    try {
      await this.ensureConnected();
      await this.client.set(this.buildKey(key), JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(`Failed to write cache key "${key}"`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.ensureConnected();
      await this.client.del(this.buildKey(key));
    } catch (error) {
      this.logger.warn(`Failed to delete cache key "${key}"`, error);
    }
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const pattern = this.buildKey(`${prefix}*`);
    let cursor = '0';

    try {
      do {
        await this.ensureConnected();
        const [nextCursor, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;

        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      this.logger.warn(`Failed to delete cache keys by prefix "${prefix}"`, error);
    }
  }

  async clear(): Promise<void> {
    await this.deleteByPrefix('');
  }

  private buildKey(key: string): string {
    if (!this.keyPrefix) {
      return key;
    }

    return `${this.keyPrefix}:${key}`;
  }

  private async ensureConnected(): Promise<void> {
    if (this.client.status === 'ready') {
      return;
    }

    if (this.connectPromise) {
      await this.connectPromise;
      return;
    }

    if (this.client.status !== 'wait') {
      return;
    }

    this.connectPromise ??= this.client.connect().finally(() => {
      this.connectPromise = null;
    });

    await this.connectPromise;
  }
}

export function createRedisCacheStore({
  keyPrefix,
  logger,
  url,
}: CreateRedisCacheStoreOptions): ManagedRedisCacheStore {
  const client = new Redis(url, {
    enableOfflineQueue: false,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: null,
  });
  const store = new RedisCacheStore(client, { keyPrefix, logger });

  return {
    store,
    async close() {
      client.disconnect();
    },
  };
}
