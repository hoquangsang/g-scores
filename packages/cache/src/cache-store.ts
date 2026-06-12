/* eslint-disable no-unused-vars */

export type CacheDriver = 'none' | 'memory' | 'redis';

export type CacheStore = {
  get<T>(...args: [string]): Promise<T | null>;
  set<T>(...args: [string, T, number]): Promise<void>;
  delete(...args: [string]): Promise<void>;
  deleteByPrefix(...args: [string]): Promise<void>;
  clear(): Promise<void>;
};

export type CacheLogger = {
  warn(...args: [string, unknown?]): void;
};
