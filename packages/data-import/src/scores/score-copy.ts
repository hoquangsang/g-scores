import { pipeline } from 'node:stream/promises';
import { from as copyFrom } from 'pg-copy-streams';
import type { Readable } from 'node:stream';
import type { PostgresClient } from '@repo/database';

const copyRawCandidateScoresSql = `
COPY raw_candidate_scores (
  sbd,
  toan,
  ngu_van,
  ngoai_ngu,
  vat_li,
  hoa_hoc,
  sinh_hoc,
  lich_su,
  dia_li,
  gdcd,
  ma_ngoai_ngu
)
FROM STDIN WITH (FORMAT csv, HEADER true)
`;

export async function copyRawCandidateScores(
  client: PostgresClient,
  source: Readable,
): Promise<void> {
  const copyStream = client.query(copyFrom(copyRawCandidateScoresSql));
  await pipeline(source, copyStream);
}
