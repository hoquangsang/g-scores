import type { ExamTrack } from '@repo/database';

import type { CatalogExamGroup, CatalogSubject } from '@/modules/catalogs/catalogs.types';

export type ScoreLevelCode = 'gte_8' | 'gte_6_lt_8' | 'gte_4_lt_6' | 'lt_4';

export type ReportSummary = {
  readonly subjectCount: number;
  readonly candidateCount: number;
};

export type ScoreLevel = {
  readonly code: ScoreLevelCode;
  readonly label: string;
  readonly minScore: number | null;
  readonly maxScore: number | null;
  readonly count: number;
};

export type ScoreLevelReport = {
  readonly subject: CatalogSubject;
  readonly levels: ScoreLevel[];
};

export type ScoreLevelReports = {
  readonly reports: ScoreLevelReport[];
};

export type ScoreDistributionItem = {
  readonly score: number;
  readonly count: number;
};

export type ScoreDistribution = {
  readonly subject: CatalogSubject;
  readonly items: ScoreDistributionItem[];
};

export type TopGroupCandidateScore = {
  readonly subjectCode: string;
  readonly subjectName: string;
  readonly score: number;
};

export type TopGroupCandidate = {
  readonly rank: number;
  readonly registrationNumber: string;
  readonly examTrack: ExamTrack;
  readonly totalScore: number;
  readonly scores: TopGroupCandidateScore[];
};

export type TopGroupReport = {
  readonly group: CatalogExamGroup;
  readonly items: TopGroupCandidate[];
};
