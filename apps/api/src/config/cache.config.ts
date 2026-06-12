import { env } from './env';

export const cacheConfig = Object.freeze({
  driver: env.API_CACHE_DRIVER,
  keyPrefix: `g-scores:${env.NODE_ENV}`,
  redisUrl: env.REDIS_URL,
  ttlSeconds: env.API_CACHE_TTL_SECONDS,
});

export type CacheConfig = typeof cacheConfig;
