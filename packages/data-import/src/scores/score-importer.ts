import { openScoreSource, type ScoreSource } from '../sources/score-source';
import { copyRawCandidateScores } from './score-copy';
import {
  assertScoreCatalogsExist,
  clearImportedScores,
  normalizeCandidateScores,
} from './score-normalize.sql';
import type { PostgresClient } from '@repo/database';
import type { ScoreImportResult } from './score-import-result';

export type ImportScoresOptions = {
  client: PostgresClient;
  source: ScoreSource;
  clearRawAfterImport: boolean;
};

export async function importScores({
  client,
  source,
  clearRawAfterImport,
}: ImportScoresOptions): Promise<ScoreImportResult> {
  await assertScoreCatalogsExist(client);
  const stream = await openScoreSource(source);
  let transactionStarted = false;

  try {
    await client.query('BEGIN');
    transactionStarted = true;
    await clearImportedScores(client);
    await copyRawCandidateScores(client, stream);
    const result = await normalizeCandidateScores(client, { clearRawAfterImport });
    await client.query('COMMIT');
    return result;
  } catch (error) {
    if (transactionStarted) {
      await client.query('ROLLBACK');
    }

    throw error;
  }
}
