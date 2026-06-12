import { ExamTrack } from '@repo/database';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';

import { ScoresRepository } from '@/modules/scores/scores.repository';

import { createTestDatabaseClient, resetCandidateData } from '../../helpers/database';
import type { DatabaseService } from '@/database';
import type { DatabaseClient } from '@repo/database';

describe(ScoresRepository.name, () => {
  let db: DatabaseClient;
  let repository: ScoresRepository;

  beforeAll(() => {
    db = createTestDatabaseClient();
    repository = new ScoresRepository({ client: db } as DatabaseService);
  });

  beforeEach(async () => {
    await resetCandidateData(db);
  });

  afterAll(async () => {
    await db?.$disconnect();
  });

  it('returns candidate score detail with foreign language and subject scores', async () => {
    const foreignLanguage = await db.foreignLanguage.findUniqueOrThrow({
      where: { code: 'N1' },
    });
    const [math, physics] = await Promise.all([
      db.subject.findUniqueOrThrow({ where: { code: 'toan' } }),
      db.subject.findUniqueOrThrow({ where: { code: 'vat_li' } }),
    ]);
    const candidate = await db.candidate.create({
      data: {
        registrationNumber: '01000001',
        examTrack: ExamTrack.NATURAL,
        foreignLanguageId: foreignLanguage.id,
      },
    });
    await db.candidateScore.createMany({
      data: [
        { candidateId: candidate.id, subjectId: physics.id, score: '8.25' },
        { candidateId: candidate.id, subjectId: math.id, score: '9.20' },
      ],
    });

    const result = await repository.findCandidateScoreDetail('01000001');

    expect(result).toMatchObject({
      registrationNumber: '01000001',
      examTrack: ExamTrack.NATURAL,
      foreignLanguage: {
        code: 'N1',
        name: 'English',
      },
    });
    expect(result?.scores).toEqual(
      expect.arrayContaining([
        { subjectCode: 'toan', subjectName: 'Mathematics', score: 9.2 },
        { subjectCode: 'vat_li', subjectName: 'Physics', score: 8.25 },
      ]),
    );
  });

  it('returns null when candidate does not exist', async () => {
    await expect(repository.findCandidateScoreDetail('missing')).resolves.toBeNull();
  });
});
