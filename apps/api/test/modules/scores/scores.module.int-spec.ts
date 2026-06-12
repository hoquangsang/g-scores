import { Test } from '@nestjs/testing';
import { describe, expect, it, jest } from '@jest/globals';
import { ExamTrack } from '@repo/database';

import { ScoresController } from '@/modules/scores/scores.controller';
import { ScoresRepository } from '@/modules/scores/scores.repository';
import { ScoresService } from '@/modules/scores/scores.service';

describe('Scores module integration', () => {
  it('wires controller, service, and repository provider', async () => {
    const findCandidateScoreDetail = jest.fn().mockResolvedValue({
      registrationNumber: '01000001',
      examTrack: ExamTrack.NATURAL,
      foreignLanguage: null,
      scores: [],
    });
    const moduleRef = await Test.createTestingModule({
      controllers: [ScoresController],
      providers: [
        ScoresService,
        {
          provide: ScoresRepository,
          useValue: {
            findCandidateScoreDetail,
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(ScoresController);
    const response = await controller.getCandidateScore({
      registrationNumber: '01000001',
    });

    expect(findCandidateScoreDetail).toHaveBeenCalledWith('01000001');
    expect(response.data).toMatchObject({
      registrationNumber: '01000001',
      examTrack: ExamTrack.NATURAL,
    });
  });
});
