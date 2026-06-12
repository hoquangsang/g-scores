import { describe, expect, it, jest } from '@jest/globals';
import { ExamTrack } from '@repo/database';

import { ERROR_CODE } from '@/common/exceptions';
import { ScoresRepository } from '@/modules/scores/scores.repository';
import { ScoresService } from '@/modules/scores/scores.service';

describe(ScoresService.name, () => {
  it('returns candidate scores sorted by subject order', async () => {
    const repository = createScoresRepositoryMock({
      findCandidateScoreDetail: jest.fn().mockResolvedValue({
        registrationNumber: '01000001',
        examTrack: ExamTrack.NATURAL,
        foreignLanguage: null,
        scores: [
          {
            subjectCode: 'hoa_hoc',
            subjectName: 'Chemistry',
            score: 9,
          },
          {
            subjectCode: 'toan',
            subjectName: 'Mathematics',
            score: 8,
          },
          {
            subjectCode: 'vat_li',
            subjectName: 'Physics',
            score: 7,
          },
        ],
      }),
    });
    const service = new ScoresService(repository);

    const result = await service.getCandidateScoreDetail('01000001');

    expect(result.scores.map((score) => score.subjectCode)).toEqual(['toan', 'vat_li', 'hoa_hoc']);
  });

  it('throws when the candidate does not exist', async () => {
    const repository = createScoresRepositoryMock({
      findCandidateScoreDetail: jest.fn().mockResolvedValue(null),
    });
    const service = new ScoresService(repository);

    await expect(service.getCandidateScoreDetail('missing')).rejects.toMatchObject({
      code: ERROR_CODE.CANDIDATE_NOT_FOUND,
    });
  });
});

function createScoresRepositoryMock(
  overrides: Partial<Record<keyof ScoresRepository, jest.Mock>>,
): ScoresRepository {
  return {
    findCandidateScoreDetail: jest.fn(),
    ...overrides,
  } as unknown as ScoresRepository;
}
