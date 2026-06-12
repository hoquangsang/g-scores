export { createApiClient, type ApiClient, type CreateApiClientOptions } from './client';
export { ApiClientError, getApiClientErrorMessage } from './errors';
export { getExamGroups, getSubjects } from './catalogs';
export { getHealth } from './health';
export {
  getReportSummary,
  getScoreDistribution,
  getScoreLevelReport,
  getScoreLevelReports,
  getTopGroupReport,
} from './reports';
export { getCandidateScore } from './scores';
export type {
  CandidateScoreDetail,
  ExamGroup,
  HealthResponse,
  ReportSummary,
  ScoreDistribution,
  ScoreLevel,
  ScoreLevelReport,
  ScoreLevelReports,
  Subject,
  SuccessEnvelope,
  TopGroupReport,
} from './types';
export type { components, operations, paths } from './generated/openapi/types';
