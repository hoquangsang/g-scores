import type { PostgresClient } from '@repo/database';
import type { ScoreImportResult } from './score-import-result';

export type NormalizeCandidateScoresOptions = {
  clearRawAfterImport: boolean;
};

const requiredSubjectCodes = [
  'toan',
  'ngu_van',
  'ngoai_ngu',
  'vat_li',
  'hoa_hoc',
  'sinh_hoc',
  'lich_su',
  'dia_li',
  'gdcd',
] as const;

export async function assertScoreCatalogsExist(client: PostgresClient): Promise<void> {
  const result = await client.query<{ code: string }>(
    'SELECT code FROM "Subject" WHERE code = ANY($1::text[])',
    [requiredSubjectCodes],
  );
  const existingCodes = new Set(result.rows.map((row) => row.code));
  const missingCodes = requiredSubjectCodes.filter((code) => !existingCodes.has(code));

  if (missingCodes.length > 0) {
    throw new Error(`Missing subject catalog data: ${missingCodes.join(', ')}`);
  }
}

export async function clearImportedScores(client: PostgresClient): Promise<void> {
  await client.query(`
    TRUNCATE TABLE
      "CandidateScore",
      "Candidate",
      raw_candidate_scores
    RESTART IDENTITY
  `);
}

export async function normalizeCandidateScores(
  client: PostgresClient,
  { clearRawAfterImport }: NormalizeCandidateScoresOptions,
): Promise<ScoreImportResult> {
  const rawRows = await countRawRows(client);
  const candidatesImported = await insertCandidates(client);
  const scoresImported = await insertCandidateScores(client);

  if (clearRawAfterImport) {
    await client.query('TRUNCATE TABLE raw_candidate_scores RESTART IDENTITY');
  }

  return {
    rawRows,
    candidatesImported,
    scoresImported,
    rawRowsRetained: !clearRawAfterImport,
  };
}

async function countRawRows(client: PostgresClient): Promise<number> {
  const result = await client.query<{ count: string }>(
    'SELECT COUNT(*) AS count FROM raw_candidate_scores',
  );
  return Number(result.rows[0]?.count ?? 0);
}

async function insertCandidates(client: PostgresClient): Promise<number> {
  const result = await client.query<{ count: string }>(`
    WITH classified_raw AS (
      SELECT
        raw.*,
        (
          (raw.vat_li IS NOT NULL)::int +
          (raw.hoa_hoc IS NOT NULL)::int +
          (raw.sinh_hoc IS NOT NULL)::int
        ) AS natural_subject_count,
        (
          (raw.lich_su IS NOT NULL)::int +
          (raw.dia_li IS NOT NULL)::int +
          (raw.gdcd IS NOT NULL)::int
        ) AS social_subject_count
      FROM raw_candidate_scores raw
    ),
    inserted AS (
      INSERT INTO "Candidate" (
        "id",
        "registrationNumber",
        "examTrack",
        "foreignLanguageId",
        "createdAt",
        "updatedAt"
      )
      SELECT
        gen_random_uuid()::text,
        raw.sbd,
        CASE
          WHEN raw.natural_subject_count > 0 AND raw.social_subject_count = 0
            THEN 'NATURAL'::"ExamTrack"
          WHEN raw.social_subject_count > 0 AND raw.natural_subject_count = 0
            THEN 'SOCIAL'::"ExamTrack"
          ELSE 'UNKNOWN'::"ExamTrack"
        END,
        foreign_language.id,
        NOW(),
        NOW()
      FROM classified_raw raw
      LEFT JOIN "ForeignLanguage" foreign_language
        ON foreign_language.code = NULLIF(raw.ma_ngoai_ngu, '')
      WHERE raw.sbd IS NOT NULL AND raw.sbd <> ''
      RETURNING 1
    )
    SELECT COUNT(*) AS count FROM inserted
  `);

  return Number(result.rows[0]?.count ?? 0);
}

async function insertCandidateScores(client: PostgresClient): Promise<number> {
  const result = await client.query<{ count: string }>(`
    WITH raw_scores AS (
      SELECT
        raw.sbd,
        score.subject_code,
        score.value
      FROM raw_candidate_scores raw
      CROSS JOIN LATERAL (
        VALUES
          ('toan', raw.toan),
          ('ngu_van', raw.ngu_van),
          ('ngoai_ngu', raw.ngoai_ngu),
          ('vat_li', raw.vat_li),
          ('hoa_hoc', raw.hoa_hoc),
          ('sinh_hoc', raw.sinh_hoc),
          ('lich_su', raw.lich_su),
          ('dia_li', raw.dia_li),
          ('gdcd', raw.gdcd)
      ) AS score(subject_code, value)
      WHERE score.value IS NOT NULL
    ),
    inserted AS (
      INSERT INTO "CandidateScore" ("candidateId", "subjectId", "score")
      SELECT
        candidate.id,
        subject.id,
        raw_scores.value
      FROM raw_scores
      INNER JOIN "Candidate" candidate
        ON candidate."registrationNumber" = raw_scores.sbd
      INNER JOIN "Subject" subject
        ON subject.code = raw_scores.subject_code
      RETURNING 1
    )
    SELECT COUNT(*) AS count FROM inserted
  `);

  return Number(result.rows[0]?.count ?? 0);
}
