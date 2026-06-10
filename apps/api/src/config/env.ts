import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(3000),
  API_CORS_ORIGINS: z.string().default('http://localhost:3001'),
  DATABASE_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables');
  console.error(JSON.stringify(z.treeifyError(parsed.error), null, 2));
  process.exit(1);
}

export const env: Env = Object.freeze(parsed.data);
