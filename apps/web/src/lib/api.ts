import {
  createApiClient,
  getApiClientErrorMessage,
  getCandidateScore as fetchCandidateScore,
  getExamGroups as fetchExamGroups,
  getReportSummary as fetchReportSummary,
  getScoreDistribution as fetchScoreDistribution,
  getScoreLevelReport as fetchScoreLevelReport,
  getScoreLevelReports as fetchScoreLevelReports,
  getSubjects as fetchSubjects,
  getTopGroupReport as fetchTopGroupReport,
  type CandidateScoreDetail,
  type ExamGroup,
  type ReportSummary,
  type ScoreDistribution,
  type ScoreLevel,
  type ScoreLevelReport,
  type ScoreLevelReports,
  type Subject,
  type TopGroupReport,
} from '@repo/api-client';

export type {
  CandidateScoreDetail,
  ExamGroup,
  ReportSummary,
  ScoreDistribution,
  ScoreLevel,
  ScoreLevelReport,
  ScoreLevelReports,
  Subject,
  TopGroupReport,
};

export type CandidateScore = CandidateScoreDetail['scores'][number];

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

const apiClient = createApiClient({
  baseUrl: apiBaseUrl,
});

export function getSubjects(): Promise<Subject[]> {
  return fetchSubjects(apiClient);
}

export function getExamGroups(): Promise<ExamGroup[]> {
  return fetchExamGroups(apiClient);
}

export function getCandidateScore(registrationNumber: string): Promise<CandidateScoreDetail> {
  return fetchCandidateScore(apiClient, registrationNumber);
}

export function getScoreLevelReports(): Promise<ScoreLevelReports> {
  return fetchScoreLevelReports(apiClient);
}

export function getReportSummary(): Promise<ReportSummary> {
  return fetchReportSummary(apiClient);
}

export function getScoreLevelReport(subjectCode: string): Promise<ScoreLevelReport> {
  return fetchScoreLevelReport(apiClient, subjectCode);
}

export function getScoreDistribution(subjectCode: string): Promise<ScoreDistribution> {
  return fetchScoreDistribution(apiClient, subjectCode);
}

export function getTopGroupReport(groupCode = 'A', limit = 10): Promise<TopGroupReport> {
  return fetchTopGroupReport(apiClient, groupCode, limit);
}

export function getErrorMessage(error: unknown): string {
  return getApiClientErrorMessage(error);
}
