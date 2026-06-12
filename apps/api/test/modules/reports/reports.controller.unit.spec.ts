import { describe, expect, it, jest } from '@jest/globals';

import { ReportsController } from '@/modules/reports/reports.controller';
import { ReportsService } from '@/modules/reports/reports.service';

describe(ReportsController.name, () => {
  it('wraps all-subject score level reports', async () => {
    const getScoreLevelReports = jest.fn().mockResolvedValue({ reports: [] });
    const controller = new ReportsController(
      createReportsServiceMock({
        getScoreLevelReports,
      }),
    );

    const response = await controller.getScoreLevelReports();

    expect(getScoreLevelReports).toHaveBeenCalledTimes(1);
    expect(response).toMatchObject({
      success: true,
      data: { reports: [] },
    });
  });

  it('passes subjectCode to single-subject score level report', async () => {
    const report = {
      subject: { code: 'toan', name: 'Toán' },
      levels: [],
    };
    const getScoreLevelReport = jest.fn().mockResolvedValue(report);
    const controller = new ReportsController(
      createReportsServiceMock({
        getScoreLevelReport,
      }),
    );

    const response = await controller.getScoreLevelReport({ subjectCode: 'toan' });

    expect(getScoreLevelReport).toHaveBeenCalledWith('toan');
    expect(response.data).toBe(report);
  });

  it('passes subjectCode to score distribution report', async () => {
    const distribution = {
      subject: { code: 'toan', name: 'Toán' },
      items: [{ score: 8.4, count: 10 }],
    };
    const getScoreDistribution = jest.fn().mockResolvedValue(distribution);
    const controller = new ReportsController(
      createReportsServiceMock({
        getScoreDistribution,
      }),
    );

    const response = await controller.getScoreDistribution({ subjectCode: 'toan' });

    expect(getScoreDistribution).toHaveBeenCalledWith('toan');
    expect(response.data).toBe(distribution);
  });

  it('passes groupCode and limit to top group report', async () => {
    const report = {
      group: { code: 'A', name: 'Khối A', subjects: [] },
      items: [],
    };
    const getTopGroupReport = jest.fn().mockResolvedValue(report);
    const controller = new ReportsController(
      createReportsServiceMock({
        getTopGroupReport,
      }),
    );

    const response = await controller.getTopGroupReport({ groupCode: 'A' }, { limit: 10 });

    expect(getTopGroupReport).toHaveBeenCalledWith('A', 10);
    expect(response.data).toBe(report);
  });
});

function createReportsServiceMock(
  overrides: Partial<Record<keyof ReportsService, jest.Mock>>,
): ReportsService {
  return {
    getScoreLevelReports: jest.fn(),
    getScoreLevelReport: jest.fn(),
    getScoreDistribution: jest.fn(),
    getTopGroupReport: jest.fn(),
    ...overrides,
  } as unknown as ReportsService;
}
