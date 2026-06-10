import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { config as loadEnv } from 'dotenv';
import { resolveDatabaseUrl } from '@repo/database';
import type { ScoreSource } from '../src/sources/score-source';

export type ImportScoresScriptOptions = {
  databaseUrl: string;
  source: ScoreSource;
  clearRawAfterImport: boolean;
};

export function resolveImportScoresOptions(): ImportScoresScriptOptions {
  loadEnv({ path: resolve(process.cwd(), '../../apps/api/.env') });

  const args = parseArgs({
    options: {
      file: { type: 'string' },
      url: { type: 'string' },
      'clear-raw-after-import': { type: 'boolean', default: false },
    },
  });

  return {
    databaseUrl: resolveDatabaseUrl({
      errorMessage: 'DATABASE_URL or DIRECT_URL is required to import scores',
    }),
    source: resolveSource(args.values.file, args.values.url),
    clearRawAfterImport: args.values['clear-raw-after-import'] ?? false,
  };
}

function resolveSource(file: string | undefined, url: string | undefined): ScoreSource {
  if (file) {
    return { kind: 'file', path: file };
  }

  const resolvedUrl = url ?? process.env['DATA_IMPORT_SCORE_CSV_URL'];

  if (!resolvedUrl) {
    throw new Error('DATA_IMPORT_SCORE_CSV_URL or --url is required to import scores');
  }

  return { kind: 'url', url: resolvedUrl };
}
