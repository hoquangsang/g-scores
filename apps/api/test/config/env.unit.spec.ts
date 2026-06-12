import { describe, expect, it } from '@jest/globals';

import { envSchema } from '@/config/env';

describe('envSchema', () => {
  it('parses API defaults and boolean flags', () => {
    const result = envSchema.parse({
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/g_scores',
      API_ENABLE_SWAGGER: 'true',
    });

    expect(result).toMatchObject({
      NODE_ENV: 'development',
      API_PORT: 3000,
      API_PREFIX: 'api',
      API_VERSION: '1',
      API_CACHE_DRIVER: 'memory',
      API_CACHE_TTL_SECONDS: 300,
      API_ENABLE_SWAGGER: true,
    });
  });

  it('requires Redis URL when Redis cache is enabled', () => {
    const result = envSchema.safeParse({
      API_CACHE_DRIVER: 'redis',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/g_scores',
    });

    expect(result.success).toBe(false);
  });

  it('rejects missing database URL', () => {
    const result = envSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
