import { Test } from '@nestjs/testing';
import { describe, expect, it, jest } from '@jest/globals';
import { CacheService } from '@repo/cache';

import { ReportsController } from '@/modules/reports/reports.controller';
import { ReportsRepository } from '@/modules/reports/reports.repository';
import { ReportsService } from '@/modules/reports/reports.service';

describe('Reports module integration', () => {
  it('wires controller, service, and repository provider', async () => {
    const findTopGroupReport = jest.fn().mockResolvedValue({
      group: {
        code: 'A',
        name: 'Khối A',
        subjects: [],
      },
      items: [],
    });
    const moduleRef = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        ReportsService,
        {
          provide: CacheService,
          useValue: {
            remember: jest.fn(async (_key, factory: () => Promise<unknown>) => factory()),
          },
        },
        {
          provide: ReportsRepository,
          useValue: {
            findScoreLevelReports: jest.fn(),
            findScoreLevelReport: jest.fn(),
            findScoreDistribution: jest.fn(),
            findTopGroupReport,
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(ReportsController);
    const response = await controller.getTopGroupReport({ groupCode: 'a' }, { limit: 10 });

    expect(findTopGroupReport).toHaveBeenCalledWith('A', 10);
    expect(response.data).toMatchObject({
      group: { code: 'A' },
      items: [],
    });
  });
});
