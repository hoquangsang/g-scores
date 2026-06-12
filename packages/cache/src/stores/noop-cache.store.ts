import type { CacheStore } from '../cache-store';

export class NoopCacheStore implements CacheStore {
  async get<T>(): Promise<T | null> {
    return null;
  }

  async set(): Promise<void> {
    return undefined;
  }

  async delete(): Promise<void> {
    return undefined;
  }

  async deleteByPrefix(): Promise<void> {
    return undefined;
  }

  async clear(): Promise<void> {
    return undefined;
  }
}
