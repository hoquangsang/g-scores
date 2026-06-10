import { createPostgresClient } from '@repo/database';
import { importScores } from '../src/scores/score-importer';
import { resolveImportScoresOptions } from './import-scores.options';

const options = resolveImportScoresOptions();
const client = createPostgresClient({ url: options.databaseUrl });

client
  .connect()
  .then(() => importScores({ client, ...options }))
  .then(async (result) => {
    console.log(
      `Import completed. rawRows=${result.rawRows} candidatesImported=${result.candidatesImported} scoresImported=${result.scoresImported} rawRowsRetained=${result.rawRowsRetained}`,
    );
    await client.end();
  })
  .catch(async (error: unknown) => {
    console.error('Import failed');
    console.error(error);
    await client.end();
    process.exit(1);
  });
