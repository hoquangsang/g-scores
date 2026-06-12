import { describe, expect, it, jest } from '@jest/globals';
import { CacheService } from '@repo/cache';

import { ERROR_CODE } from '@/common/exceptions';
import { ReportsRepository } from '@/modules/reports/reports.repository';
import { ReportsService } from '@/modules/reports/reports.service';

describe(ReportsService.name, () => {
  it('returns report summary from cache', async () => {
    const summary = {
      subjectCount: 9,
      candidateCount: 5,
    };
    const repository = createReportsRepositoryMock({
      findReportSummary: jest.fn().mockResolvedValue(summary),
    });
    const service = new ReportsService(repository, createCacheServiceMock());

    await expect(service.getReportSummary()).resolves.toBe(summary);
  });

  it('returns all score level reports sorted by subject order', async () => {
    const repository = createReportsRepositoryMock({
      findScoreLevelReports: jest
        .fn()
        .mockResolvedValue([
          createScoreLevelReport('hoa_hoc'),
          createScoreLevelReport('toan'),
          createScoreLevelReport('vat_li'),
        ]),
    });
    const service = new ReportsService(repository, createCacheServiceMock());

    const result = await service.getScoreLevelReports();

    expect(result.reports.map((report) => report.subject.code)).toEqual([
      'toan',
      'vat_li',
      'hoa_hoc',
    ]);
  });

  it('returns a subject score level report', async () => {
    const report = createScoreLevelReport('toan');
    const repository = createReportsRepositoryMock({
      findScoreLevelReport: jest.fn().mockResolvedValue(report),
    });
    const service = new ReportsService(repository, createCacheServiceMock());

    await expect(service.getScoreLevelReport('toan')).resolves.toBe(report);
  });

  it('throws when the score level subject does not exist', async () => {
    const repository = createReportsRepositoryMock({
      findScoreLevelReport: jest.fn().mockResolvedValue(null),
    });
    const service = new ReportsService(repository, createCacheServiceMock());

    await expect(service.getScoreLevelReport('missing')).rejects.toMatchObject({
      code: ERROR_CODE.SUBJECT_NOT_FOUND,
    });
  });

  it('returns subject score distribution', async () => {
    const distribution = {
      subject: { code: 'toan', name: 'Toán' },
      items: [{ score: 8.4, count: 10 }],
    };
    const repository = createReportsRepositoryMock({
      findScoreDistribution: jest.fn().mockResolvedValue(distribution),
    });
    const service = new ReportsService(repository, createCacheServiceMock());

    await expect(service.getScoreDistribution('toan')).resolves.toBe(distribution);
  });

  it('throws when the score distribution subject does not exist', async () => {
    const repository = createReportsRepositoryMock({
      findScoreDistribution: jest.fn().mockResolvedValue(null),
    });
    const service = new ReportsService(repository, createCacheServiceMock());

    await expect(service.getScoreDistribution('missing')).rejects.toMatchObject({
      code: ERROR_CODE.SUBJECT_NOT_FOUND,
    });
  });

  it('normalizes group code before loading top group report', async () => {
    const findTopGroupReport = jest.fn().mockResolvedValue({
      group: {
        code: 'A',
        name: 'Group A',
        subjects: [],
      },
      items: [],
    });
    const repository = createReportsRepositoryMock({
      findTopGroupReport,
    });
    const service = new ReportsService(repository, createCacheServiceMock());

    await service.getTopGroupReport('a', 10);

    expect(findTopGroupReport).toHaveBeenCalledWith('A', 10);
  });

  it('throws when the top group does not exist', async () => {
    const repository = createReportsRepositoryMock({
      findTopGroupReport: jest.fn().mockResolvedValue(null),
    });
    const service = new ReportsService(repository, createCacheServiceMock());

    await expect(service.getTopGroupReport('missing', 10)).rejects.toMatchObject({
      code: ERROR_CODE.EXAM_GROUP_NOT_FOUND,
    });
  });
});

function createReportsRepositoryMock(
  overrides: Partial<Record<keyof ReportsRepository, jest.Mock>>,
): ReportsRepository {
  return {
    findReportSummary: jest.fn(),
    findScoreLevelReports: jest.fn(),
    findScoreLevelReport: jest.fn(),
    findScoreDistribution: jest.fn(),
    findTopGroupReport: jest.fn(),
    ...overrides,
  } as unknown as ReportsRepository;
}

function createCacheServiceMock(): CacheService {
  return {
    remember: jest.fn(async (_key, factory: () => Promise<unknown>) => factory()),
  } as unknown as CacheService;
}

function createScoreLevelReport(subjectCode: string) {
  return {
    subject: {
      code: subjectCode,
      name: subjectCode,
    },
    levels: [],
  };
}
