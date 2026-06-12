import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDatabaseClient } from '../src/client';
import { resolveDatabaseUrl } from '../src/database-url';
import type { DatabaseClient } from '../src/client';

describe('database integration smoke', () => {
  let db: DatabaseClient;

  beforeAll(() => {
    assertTestDatabaseUrl();

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
    const [subjects, foreignLanguages, examGroups] = await Promise.all([
      db.subject.findMany({ orderBy: { code: 'asc' } }),
      db.foreignLanguage.findMany({ orderBy: { code: 'asc' } }),
      db.examGroup.findMany({ orderBy: { code: 'asc' } }),
    ]);

    expect(subjects.map((subject) => subject.code).sort()).toEqual([
      'dia_li',
      'gdcd',
      'hoa_hoc',
      'lich_su',
      'ngoai_ngu',
      'ngu_van',
      'sinh_hoc',
      'toan',
      'vat_li',
    ]);
    expect(foreignLanguages.map((language) => language.code)).toEqual([
      'N1',
      'N2',
      'N3',
      'N4',
      'N5',
      'N6',
      'N7',
    ]);
    expect(examGroups.map((group) => group.code)).toEqual(['A', 'A1', 'B', 'C', 'D']);
  });

  it('has exact exam group subject mappings', async () => {
    const groups = await db.examGroup.findMany({
      include: {
        subjects: {
          include: { subject: true },
        },
      },
    });
    const subjectsByGroupCode = Object.fromEntries(
      groups.map((group) => [group.code, group.subjects.map((item) => item.subject.code).sort()]),
    );

    expect(subjectsByGroupCode).toMatchObject({
      A: ['hoa_hoc', 'toan', 'vat_li'],
      A1: ['ngoai_ngu', 'toan', 'vat_li'],
      B: ['hoa_hoc', 'sinh_hoc', 'toan'],
      C: ['dia_li', 'lich_su', 'ngu_van'],
      D: ['ngoai_ngu', 'ngu_van', 'toan'],
    });
  });

  it('enforces candidate and score uniqueness constraints', async () => {
    await db.candidate.deleteMany({
      where: {
        registrationNumber: 'test-unique-001',
      },
    });
    const subject = await db.subject.findUniqueOrThrow({ where: { code: 'toan' } });
    const candidate = await db.candidate.create({
      data: {
        registrationNumber: 'test-unique-001',
      },
    });

    await expect(
      db.candidate.create({
        data: {
          registrationNumber: 'test-unique-001',
        },
      }),
    ).rejects.toThrow();

    await db.candidateScore.create({
      data: {
        candidateId: candidate.id,
        subjectId: subject.id,
        score: '8.00',
      },
    });
    await expect(
      db.candidateScore.create({
        data: {
          candidateId: candidate.id,
          subjectId: subject.id,
          score: '9.00',
        },
      }),
    ).rejects.toThrow();
  });

  it('has the raw score staging table', async () => {
    await expect(db.$queryRaw`SELECT COUNT(*) FROM raw_candidate_scores`).resolves.toBeDefined();
  });
});

function assertTestDatabaseUrl(): void {
  const databaseUrl = resolveDatabaseUrl({
    errorMessage: 'DATABASE_URL or DIRECT_URL is required for database integration tests',
  });

  if (!databaseUrl.includes('g_scores_test') && !databaseUrl.includes(':5433/')) {
    throw new Error('Refusing to run database integration tests outside the test database');
  }
}
