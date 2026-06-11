import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDatabaseClient } from '../src/client';
import { resolveDatabaseUrl } from '../src/database-url';
import type { DatabaseClient } from '../src/client';

describe('database integration smoke', () => {
  let db: DatabaseClient;

  beforeAll(() => {
    db = createDatabaseClient({
      url: resolveDatabaseUrl({
        errorMessage: 'DATABASE_URL or DIRECT_URL is required for database integration tests',
      }),
    });
  });

  afterAll(async () => {
    await db?.$disconnect();
  });

  it('connects to the test database', async () => {
    await expect(db.$queryRaw`SELECT 1 AS value`).resolves.toEqual([{ value: 1 }]);
  });

  it('has seeded score catalogs', async () => {
    const [subjectCount, foreignLanguageCount, examGroupCount] = await Promise.all([
      db.subject.count(),
      db.foreignLanguage.count(),
      db.examGroup.count(),
    ]);

    expect(subjectCount).toBeGreaterThanOrEqual(9);
    expect(foreignLanguageCount).toBeGreaterThanOrEqual(7);
    expect(examGroupCount).toBeGreaterThanOrEqual(5);
  });

  it('has the group A subject mapping', async () => {
    const groupA = await db.examGroup.findUnique({
      where: { code: 'A' },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    expect(groupA).not.toBeNull();
    expect(groupA?.subjects.map((item) => item.subject.code).sort()).toEqual([
      'hoa_hoc',
      'toan',
      'vat_li',
    ]);
  });
});
