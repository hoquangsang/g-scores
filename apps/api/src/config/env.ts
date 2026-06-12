import 'dotenv/config';
import { z } from 'zod';

const booleanSchema = z.preprocess((value) => {
  if (value === undefined || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === 'true') {
      return true;
    }

    if (normalizedValue === 'false') {
      return false;
    }
  }

  return value;
}, z.boolean());

const optionalUrlSchema = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
}, z.url().optional());

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    API_PORT: z.coerce.number().int().positive().default(3000),
    API_PREFIX: z.string().min(1).default('api'),
    API_VERSION: z.string().min(1).default('1'),
    API_CORS_ORIGINS: z.string().default('http://localhost:3001'),
    API_ENABLE_SWAGGER: booleanSchema.default(false),
    API_CACHE_DRIVER: z.enum(['none', 'memory', 'redis']).default('memory'),
    API_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(300),
    REDIS_URL: optionalUrlSchema,
    DATABASE_URL: z.url(),
  })
  .superRefine((value, context) => {
    if (value.API_CACHE_DRIVER === 'redis' && !value.REDIS_URL) {
      context.addIssue({
        code: 'custom',
        message: 'REDIS_URL is required when API_CACHE_DRIVER=redis',
        path: ['REDIS_URL'],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables');
  console.error(JSON.stringify(z.treeifyError(parsed.error), null, 2));
  process.exit(1);
}

export const env: Env = Object.freeze(parsed.data);
