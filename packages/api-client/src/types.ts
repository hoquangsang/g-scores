import type { components } from './generated/openapi/types';

export type HealthResponse = components['schemas']['HealthResponseDto'];
export type Subject = components['schemas']['SubjectResponseDto'];
export type ExamGroup = components['schemas']['ExamGroupResponseDto'];
export type CandidateScoreDetail = components['schemas']['CandidateScoreResponseDto'];
export type ReportSummary = components['schemas']['ReportSummaryResponseDto'];
export type ScoreLevel = components['schemas']['ScoreLevelResponseDto'];
export type ScoreLevelReport = components['schemas']['ScoreLevelReportResponseDto'];
export type ScoreLevelReports = components['schemas']['ScoreLevelReportsResponseDto'];
export type ScoreDistribution = components['schemas']['ScoreDistributionResponseDto'];
export type TopGroupReport = components['schemas']['TopGroupReportResponseDto'];

export type SuccessEnvelope<TData> = components['schemas']['SuccessResponse'] & {
  readonly data?: TData;
};
