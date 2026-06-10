import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'prisma/config';

const localDatabaseUrl = 'postgresql://postgres:postgres@localhost:5432/g_scores?schema=public';

loadEnv({ path: resolve(process.cwd(), '../../apps/api/.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node dist/seed.js',
  },
  datasource: {
    url: process.env['DIRECT_URL'] ?? process.env['DATABASE_URL'] ?? localDatabaseUrl,
  },
});
