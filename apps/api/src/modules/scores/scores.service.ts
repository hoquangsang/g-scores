import { Injectable } from '@nestjs/common';

import { AppException, ERROR_CODE } from '@/common/exceptions';
import { getSubjectOrderIndex } from '@/modules/catalogs/catalog.constants';

import { ScoresRepository } from './scores.repository';
import type { CandidateScoreDetail } from './scores.types';

@Injectable()
export class ScoresService {
  private readonly scoresRepository: ScoresRepository;

  constructor(scoresRepository: ScoresRepository) {
    this.scoresRepository = scoresRepository;
  }

  async getCandidateScoreDetail(registrationNumber: string): Promise<CandidateScoreDetail> {
    const candidate = await this.scoresRepository.findCandidateScoreDetail(registrationNumber);

    if (!candidate) {
      throw new AppException({
        code: ERROR_CODE.CANDIDATE_NOT_FOUND,
        message: `Candidate ${registrationNumber} was not found`,
      });
    }

    return {
      ...candidate,
      scores: candidate.scores.toSorted(
        (left, right) =>
          getSubjectOrderIndex(left.subjectCode) - getSubjectOrderIndex(right.subjectCode) ||
          left.subjectCode.localeCompare(right.subjectCode),
      ),
    };
  }
}
