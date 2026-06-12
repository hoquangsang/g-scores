import { resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createPostgresClient, resolveDatabaseUrl } from '@repo/database';
import { importScores } from '../src';
import type { PostgresClient } from '@repo/database';

const sampleCsvPath = resolve(process.cwd(), 'test/fixtures/scores.sample.csv');

describe('score import integration', () => {
  let client: PostgresClient;

  beforeAll(async () => {
    assertTestDatabaseUrl();

    client = createPostgresClient({
      url: resolveDatabaseUrl({
        errorMessage: 'DATABASE_URL or DIRECT_URL is required for score import integration tests',
      }),
    });
    await client.connect();
  });

  afterAll(async () => {
    await client?.end();
  });

  it('imports the sample CSV into raw and normalized score tables', async () => {
    const result = await importScores({
      client,
      source: { kind: 'file', path: sampleCsvPath },
      clearRawAfterImport: false,
    });

    expect(result).toEqual({
      rawRows: 8,
      candidatesImported: 8,
      scoresImported: 37,
      rawRowsRetained: true,
    });

    await expectTableCount('raw_candidate_scores', 8);
    await expectTableCount('"Candidate"', 8);
    await expectTableCount('"CandidateScore"', 37);
    await expectTrackCounts({
      NATURAL: 4,
      SOCIAL: 1,
      UNKNOWN: 3,
    });
    await expectCandidateTrack('01000001', 'NATURAL');
    await expectCandidateTrack('01000002', 'SOCIAL');
    await expectCandidateTrack('01000006', 'UNKNOWN');
    await expectCandidateTrack('01000007', 'UNKNOWN');
    await expectCandidateTrack('01000008', 'UNKNOWN');
    await expectCandidateHasScore('01000004', 'toan', false);
    await expectCandidateHasScore('01000005', 'hoa_hoc', false);
    await expectCandidateHasScore('01000005', 'sinh_hoc', true);
  });

  it('can be rerun without duplicating normalized data', async () => {
    const result = await importScores({
      client,
      source: { kind: 'file', path: sampleCsvPath },
      clearRawAfterImport: false,
    });

    expect(result).toMatchObject({
      rawRows: 8,
      candidatesImported: 8,
      scoresImported: 37,
    });

    await expectTableCount('raw_candidate_scores', 8);
    await expectTableCount('"Candidate"', 8);
    await expectTableCount('"CandidateScore"', 37);
  });

  it('can clear raw rows after normalizing the import', async () => {
    const result = await importScores({
      client,
      source: { kind: 'file', path: sampleCsvPath },
      clearRawAfterImport: true,
    });

    expect(result).toEqual({
      rawRows: 8,
      candidatesImported: 8,
      scoresImported: 37,
      rawRowsRetained: false,
    });

    await expectTableCount('raw_candidate_scores', 0);
    await expectTableCount('"Candidate"', 8);
    await expectTableCount('"CandidateScore"', 37);
    await expectCandidateTrack('01000001', 'NATURAL');
    await expectCandidateHasScore('01000005', 'hoa_hoc', false);
  });

  async function expectTableCount(tableName: string, expected: number): Promise<void> {
    const result = await client.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM ${tableName}`,
    );
    expect(Number(result.rows[0]?.count ?? 0)).toBe(expected);
  }

  async function expectTrackCounts(expected: Record<string, number>): Promise<void> {
    const result = await client.query<{ examTrack: string; count: string }>(`
      SELECT "examTrack", COUNT(*) AS count
      FROM "Candidate"
      GROUP BY "examTrack"
      ORDER BY "examTrack"
    `);

    const actual = Object.fromEntries(result.rows.map((row) => [row.examTrack, Number(row.count)]));

    expect(actual).toEqual(expected);
  }

  async function expectCandidateTrack(
    registrationNumber: string,
    expectedTrack: string,
  ): Promise<void> {
    const result = await client.query<{ examTrack: string }>(
      'SELECT "examTrack" FROM "Candidate" WHERE "registrationNumber" = $1',
      [registrationNumber],
    );

    expect(result.rows[0]?.examTrack).toBe(expectedTrack);
  }

  async function expectCandidateHasScore(
    registrationNumber: string,
    subjectCode: string,
    expected: boolean,
  ): Promise<void> {
    const result = await client.query<{ count: string }>(
      `
        SELECT COUNT(*) AS count
        FROM "CandidateScore" score
        INNER JOIN "Candidate" candidate
          ON candidate.id = score."candidateId"
        INNER JOIN "Subject" subject
          ON subject.id = score."subjectId"
        WHERE candidate."registrationNumber" = $1
          AND subject.code = $2
      `,
      [registrationNumber, subjectCode],
    );

    expect(Number(result.rows[0]?.count ?? 0) > 0).toBe(expected);
  }
});

function assertTestDatabaseUrl(): void {
  const databaseUrl = resolveDatabaseUrl({
    errorMessage: 'DATABASE_URL or DIRECT_URL is required for score import integration tests',
  });

  if (!databaseUrl.includes('g_scores_test') && !databaseUrl.includes(':5433/')) {
    throw new Error('Refusing to run score import integration tests outside the test database');
  }
}
