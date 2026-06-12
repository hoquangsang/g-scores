import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@/database';

import type { CandidateScoreDetail } from './scores.types';

@Injectable()
export class ScoresRepository {
  private readonly database: DatabaseService;

  constructor(database: DatabaseService) {
    this.database = database;
  }

  async findCandidateScoreDetail(registrationNumber: string): Promise<CandidateScoreDetail | null> {
    const candidate = await this.database.client.candidate.findUnique({
      where: {
        registrationNumber,
      },
      select: {
        registrationNumber: true,
        examTrack: true,
        foreignLanguage: {
          select: {
            code: true,
            name: true,
          },
        },
        scores: {
          select: {
            score: true,
            subject: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!candidate) {
      return null;
    }

    return {
      registrationNumber: candidate.registrationNumber,
      examTrack: candidate.examTrack,
      foreignLanguage: candidate.foreignLanguage,
      scores: candidate.scores.map((score) => ({
        subjectCode: score.subject.code,
        subjectName: score.subject.name,
        score: score.score.toNumber(),
      })),
    };
  }
}
