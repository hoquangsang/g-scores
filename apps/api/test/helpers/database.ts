import { createDatabaseClient, resolveDatabaseUrl } from '@repo/database';
import type { DatabaseClient } from '@repo/database';

export function createTestDatabaseClient(): DatabaseClient {
  assertTestDatabaseUrl();

  return createDatabaseClient({
    url: resolveDatabaseUrl({
      errorMessage: 'DATABASE_URL or DIRECT_URL is required for API integration tests',
    }),
  });
}

export async function resetCandidateData(db: DatabaseClient): Promise<void> {
  assertTestDatabaseUrl();
  await db.candidateScore.deleteMany();
  await db.candidate.deleteMany();
}

function assertTestDatabaseUrl(): void {
  const databaseUrl = resolveDatabaseUrl({
    errorMessage: 'DATABASE_URL or DIRECT_URL is required for API integration tests',
  });

  if (!databaseUrl.includes('g_scores_test') && !databaseUrl.includes(':5433/')) {
    throw new Error('Refusing to run API integration tests outside the test database');
  }
}
