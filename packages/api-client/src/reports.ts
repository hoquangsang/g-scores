import type { ApiClient } from './client';
import { unwrapData } from './response';
import type {
  ReportSummary,
  ScoreDistribution,
  ScoreLevelReport,
  ScoreLevelReports,
  TopGroupReport,
} from './types';

export function getReportSummary(client: ApiClient): Promise<ReportSummary> {
  return unwrapData(client.GET('/api/v1/reports/summary'), 'Failed to load report summary');
}

export function getScoreLevelReports(client: ApiClient): Promise<ScoreLevelReports> {
  return unwrapData(client.GET('/api/v1/reports/score-levels'), 'Failed to load score levels');
}

export function getScoreLevelReport(
  client: ApiClient,
  subjectCode: string,
): Promise<ScoreLevelReport> {
  return unwrapData(
    client.GET('/api/v1/reports/score-levels/{subjectCode}', {
      params: {
        path: {
          subjectCode,
        },
      },
    }),
    'Failed to load subject score levels',
  );
}

export function getScoreDistribution(
  client: ApiClient,
  subjectCode: string,
): Promise<ScoreDistribution> {
  return unwrapData(
    client.GET('/api/v1/reports/score-distribution/{subjectCode}', {
      params: {
        path: {
          subjectCode,
        },
      },
    }),
    'Failed to load score distribution',
  );
}

export function getTopGroupReport(
  client: ApiClient,
  groupCode = 'A',
  limit = 10,
): Promise<TopGroupReport> {
  return unwrapData(
    client.GET('/api/v1/reports/top-groups/{groupCode}', {
      params: {
        path: {
          groupCode,
        },
        query: {
          limit,
        },
      },
    }),
    'Failed to load top group report',
  );
}
