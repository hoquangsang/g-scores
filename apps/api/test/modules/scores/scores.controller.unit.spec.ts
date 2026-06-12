import { describe, expect, it, jest } from '@jest/globals';
import { ExamTrack } from '@repo/database';

import { ScoresController } from '@/modules/scores/scores.controller';
import { ScoresService } from '@/modules/scores/scores.service';

describe(ScoresController.name, () => {
  it('wraps candidate score lookup response', async () => {
    const getCandidateScoreDetail = jest.fn().mockResolvedValue({
      registrationNumber: '01000001',
      examTrack: ExamTrack.NATURAL,
      foreignLanguage: null,
      scores: [{ subjectCode: 'toan', subjectName: 'Toán', score: 8.4 }],
    });
    const controller = new ScoresController(
      createScoresServiceMock({
        getCandidateScoreDetail,
      }),
    );

    const response = await controller.getCandidateScore({
      registrationNumber: '01000001',
    });

    expect(getCandidateScoreDetail).toHaveBeenCalledWith('01000001');
    expect(response).toMatchObject({
      success: true,
      data: {
        registrationNumber: '01000001',
        scores: [{ subjectCode: 'toan', score: 8.4 }],
      },
    });
  });
});

function createScoresServiceMock(
  overrides: Partial<Record<keyof ScoresService, jest.Mock>>,
): ScoresService {
  return {
    getCandidateScoreDetail: jest.fn(),
    ...overrides,
  } as unknown as ScoresService;
}
