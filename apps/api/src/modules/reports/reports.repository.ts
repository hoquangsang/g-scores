import { Injectable } from '@nestjs/common';
import { Prisma, type ExamTrack } from '@repo/database';

import { DatabaseService } from '@/database';
import { getExamGroupSubjectOrderIndex } from '@/modules/catalogs/catalog.constants';
import type { CatalogExamGroup, CatalogSubject } from '@/modules/catalogs/catalogs.types';

import type {
  ReportSummary,
  ScoreDistribution,
  ScoreLevelReport,
  TopGroupReport,
} from './reports.types';

type ScoreLevelCountRow = {
  readonly gte8: bigint | number | string;
  readonly gte6lt8: bigint | number | string;
  readonly gte4lt6: bigint | number | string;
  readonly lt4: bigint | number | string;
};

type SubjectScoreLevelCountRow = ScoreLevelCountRow & {
  readonly subjectCode: string;
  readonly subjectName: string;
};

type ScoreDistributionRow = {
  readonly score: number | string;
  readonly count: bigint | number | string;
};

type TopGroupRankRow = {
  readonly candidateId: string;
  readonly registrationNumber: string;
  readonly examTrack: ExamTrack;
  readonly totalScore: number | string;
};

@Injectable()
export class ReportsRepository {
  private readonly database: DatabaseService;

  constructor(database: DatabaseService) {
    this.database = database;
  }

  async findReportSummary(): Promise<ReportSummary> {
    const [subjectCount, candidateCount] = await Promise.all([
      this.database.client.subject.count(),
      this.database.client.candidate.count(),
    ]);

    return {
      subjectCount,
      candidateCount,
    };
  }

  async findScoreLevelReports(): Promise<ScoreLevelReport[]> {
    const rows = await this.database.client.$queryRaw<SubjectScoreLevelCountRow[]>`
      SELECT
        subject.code AS "subjectCode",
        subject.name AS "subjectName",
        COUNT(score."candidateId") FILTER (WHERE score.score >= 8) AS "gte8",
        COUNT(score."candidateId") FILTER (WHERE score.score >= 6 AND score.score < 8) AS "gte6lt8",
        COUNT(score."candidateId") FILTER (WHERE score.score >= 4 AND score.score < 6) AS "gte4lt6",
        COUNT(score."candidateId") FILTER (WHERE score.score < 4) AS "lt4"
      FROM "Subject" subject
      LEFT JOIN "CandidateScore" score
        ON score."subjectId" = subject.id
      GROUP BY subject.id, subject.code, subject.name
      ORDER BY subject.code ASC
    `;

    return rows.map((row) =>
      toScoreLevelReport(
        {
          code: row.subjectCode,
          name: row.subjectName,
        },
        row,
      ),
    );
  }

  async findScoreLevelReport(subjectCode: string): Promise<ScoreLevelReport | null> {
    const subject = await this.database.client.subject.findUnique({
      where: {
        code: subjectCode,
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    if (!subject) {
      return null;
    }

    const [counts] = await this.database.client.$queryRaw<ScoreLevelCountRow[]>`
      SELECT
        COUNT(*) FILTER (WHERE score >= 8) AS "gte8",
        COUNT(*) FILTER (WHERE score >= 6 AND score < 8) AS "gte6lt8",
        COUNT(*) FILTER (WHERE score >= 4 AND score < 6) AS "gte4lt6",
        COUNT(*) FILTER (WHERE score < 4) AS "lt4"
      FROM "CandidateScore"
      WHERE "subjectId" = ${subject.id}
    `;

    return toScoreLevelReport(subject, counts);
  }

  async findScoreDistribution(subjectCode: string): Promise<ScoreDistribution | null> {
    const subject = await this.database.client.subject.findUnique({
      where: {
        code: subjectCode,
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    if (!subject) {
      return null;
    }

    const rows = await this.database.client.$queryRaw<ScoreDistributionRow[]>`
      SELECT
        score::double precision AS "score",
        COUNT(*) AS "count"
      FROM "CandidateScore"
      WHERE "subjectId" = ${subject.id}
      GROUP BY score
      ORDER BY score ASC
    `;

    return {
      subject: {
        code: subject.code,
        name: subject.name,
      },
      items: rows.map((row) => ({
        score: toNumber(row.score),
        count: toNumber(row.count),
      })),
    };
  }

  async findTopGroupReport(groupCode: string, limit: number): Promise<TopGroupReport | null> {
    const examGroup = await this.findExamGroup(groupCode);

    if (!examGroup) {
      return null;
    }

    const subjectIds = examGroup.subjects.map((subject) => subject.id);

    if (subjectIds.length === 0) {
      return {
        group: toCatalogExamGroup(examGroup),
        items: [],
      };
    }

    const rankedCandidates = await this.database.client.$queryRaw<TopGroupRankRow[]>(
      Prisma.sql`
        WITH ranked_scores AS (
          SELECT
            score."candidateId",
            SUM(score.score)::double precision AS "totalScore"
          FROM "CandidateScore" score
          WHERE score."subjectId" IN (${Prisma.join(subjectIds)})
          GROUP BY score."candidateId"
          HAVING COUNT(*) = ${subjectIds.length}
        )
        SELECT
          candidate.id AS "candidateId",
          candidate."registrationNumber",
          candidate."examTrack",
          ranked_scores."totalScore"
        FROM ranked_scores
        INNER JOIN "Candidate" candidate
          ON candidate.id = ranked_scores."candidateId"
        ORDER BY ranked_scores."totalScore" DESC, candidate."registrationNumber" ASC
        LIMIT ${limit}
      `,
    );

    const candidateIds = rankedCandidates.map((candidate) => candidate.candidateId);
    const scores = await this.database.client.candidateScore.findMany({
      where: {
        candidateId: {
          in: candidateIds,
        },
        subjectId: {
          in: subjectIds,
        },
      },
      select: {
        candidateId: true,
        score: true,
        subject: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    const scoresByCandidateId = new Map<string, typeof scores>();

    for (const score of scores) {
      const existingScores = scoresByCandidateId.get(score.candidateId) ?? [];
      existingScores.push(score);
      scoresByCandidateId.set(score.candidateId, existingScores);
    }

    return {
      group: toCatalogExamGroup(examGroup),
      items: rankedCandidates.map((candidate, index) => ({
        rank: index + 1,
        registrationNumber: candidate.registrationNumber,
        examTrack: candidate.examTrack,
        totalScore: toNumber(candidate.totalScore),
        scores: (scoresByCandidateId.get(candidate.candidateId) ?? [])
          .map((score) => ({
            subjectCode: score.subject.code,
            subjectName: score.subject.name,
            score: score.score.toNumber(),
          }))
          .toSorted(
            (left, right) =>
              getExamGroupSubjectOrderIndex(examGroup.code, left.subjectCode) -
                getExamGroupSubjectOrderIndex(examGroup.code, right.subjectCode) ||
              left.subjectCode.localeCompare(right.subjectCode),
          ),
      })),
    };
  }

  private async findExamGroup(groupCode: string): Promise<ExamGroupQueryResult | null> {
    const examGroup = await this.database.client.examGroup.findUnique({
      where: {
        code: groupCode,
      },
      select: {
        code: true,
        name: true,
        subjects: {
          select: {
            subject: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!examGroup) {
      return null;
    }

    return {
      code: examGroup.code,
      name: examGroup.name,
      subjects: examGroup.subjects
        .map(({ subject }) => subject)
        .toSorted(
          (left, right) =>
            getExamGroupSubjectOrderIndex(examGroup.code, left.code) -
              getExamGroupSubjectOrderIndex(examGroup.code, right.code) ||
            left.code.localeCompare(right.code),
        ),
    };
  }
}

type ExamGroupQueryResult = {
  readonly code: string;
  readonly name: string;
  readonly subjects: Array<CatalogSubject & { readonly id: string }>;
};

function toCatalogExamGroup(examGroup: ExamGroupQueryResult): CatalogExamGroup {
  return {
    code: examGroup.code,
    name: examGroup.name,
    subjects: examGroup.subjects.map(({ code, name }) => ({ code, name })),
  };
}

function toScoreLevelReport(
  subject: CatalogSubject,
  counts: ScoreLevelCountRow | undefined,
): ScoreLevelReport {
  return {
    subject: {
      code: subject.code,
      name: subject.name,
    },
    levels: [
      {
        code: 'gte_8',
        label: '>= 8',
        minScore: 8,
        maxScore: null,
        count: toNumber(counts?.gte8),
      },
      {
        code: 'gte_6_lt_8',
        label: '>= 6 and < 8',
        minScore: 6,
        maxScore: 8,
        count: toNumber(counts?.gte6lt8),
      },
      {
        code: 'gte_4_lt_6',
        label: '>= 4 and < 6',
        minScore: 4,
        maxScore: 6,
        count: toNumber(counts?.gte4lt6),
      },
      {
        code: 'lt_4',
        label: '< 4',
        minScore: null,
        maxScore: 4,
        count: toNumber(counts?.lt4),
      },
    ],
  };
}

function toNumber(value: bigint | number | string | undefined): number {
  if (value === undefined) {
    return 0;
  }

  return Number(value);
}
