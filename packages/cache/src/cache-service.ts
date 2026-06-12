import type { CacheStore } from './cache-store';

export type CacheServiceOptions = {
  defaultTtlSeconds: number;
};

export type CacheRememberOptions = {
  ttlSeconds?: number;
};

export class CacheService {
  private readonly defaultTtlSeconds: number;
  private readonly store: CacheStore;

  constructor(store: CacheStore, options: CacheServiceOptions) {
    this.store = store;
    this.defaultTtlSeconds = options.defaultTtlSeconds;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.store.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlSeconds = this.defaultTtlSeconds): Promise<void> {
    await this.store.set(key, value, ttlSeconds);
  }

  async remember<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheRememberOptions = {},
  ): Promise<T> {
    const cachedValue = await this.store.get<T>(key);

    if (cachedValue !== null) {
      return cachedValue;
    }

    const value = await factory();

    if (value !== undefined) {
      await this.store.set(key, value, options.ttlSeconds ?? this.defaultTtlSeconds);
    }

    return value;
  }

  async delete(key: string): Promise<void> {
    await this.store.delete(key);
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    await this.store.deleteByPrefix(prefix);
  }

  async clear(): Promise<void> {
    await this.store.clear();
  }
}
