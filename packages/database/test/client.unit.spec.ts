import { describe, expect, it } from 'vitest';

import { createDatabaseClient } from '../src/client';
import { createPostgresClient } from '../src/postgres-client';

describe('database client factories', () => {
  it('creates a Prisma database client', async () => {
    const client = createDatabaseClient({
      url: 'postgresql://postgres:postgres@localhost:5432/g_scores',
    });

    expect(client.candidate).toBeDefined();
    expect(client.$connect).toEqual(expect.any(Function));
    await client.$disconnect();
  });

  it('creates a pg client', () => {
    const client = createPostgresClient({
      url: 'postgresql://postgres:postgres@localhost:5432/g_scores',
    });

    expect(client.connect).toEqual(expect.any(Function));
    expect(client.end).toEqual(expect.any(Function));
  });
});
