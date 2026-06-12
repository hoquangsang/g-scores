import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';

import { AppException, ERROR_CODE } from '@/common/exceptions';
import { GlobalExceptionFilter } from '@/common/filters';
import { ReportsController } from '@/modules/reports/reports.controller';
import { ReportsService } from '@/modules/reports/reports.service';
import { setupApiRouting } from '@/setup';

describe(ReportsController.name, () => {
  let app: INestApplication;
  const reportsService = {
    getScoreLevelReports: jest.fn(),
    getScoreLevelReport: jest.fn(),
    getScoreDistribution: jest.fn(),
    getTopGroupReport: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: reportsService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    setupApiRouting({
      app,
      apiPrefix: 'api',
      defaultVersion: '1',
    });
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns score level reports for all subjects', async () => {
    reportsService.getScoreLevelReports.mockResolvedValue({
      reports: [createScoreLevelReport('toan')],
    });

    await request(app.getHttpServer())
      .get('/api/v1/reports/score-levels')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.reports).toHaveLength(1);
        expect(body.data.reports[0].subject.code).toBe('toan');
      });
  });

  it('returns score level report by subject', async () => {
    reportsService.getScoreLevelReport.mockResolvedValue(createScoreLevelReport('toan'));

    await request(app.getHttpServer())
      .get('/api/v1/reports/score-levels/toan')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.subject.code).toBe('toan');
      });

    expect(reportsService.getScoreLevelReport).toHaveBeenCalledWith('toan');
  });

  it('returns score distribution by subject', async () => {
    reportsService.getScoreDistribution.mockResolvedValue({
      subject: {
        code: 'toan',
        name: 'toan',
      },
      items: [
        {
          score: 8.2,
          count: 12,
        },
      ],
    });

    await request(app.getHttpServer())
      .get('/api/v1/reports/score-distribution/toan')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.items).toEqual([{ score: 8.2, count: 12 }]);
      });
  });

  it('returns top group report', async () => {
    reportsService.getTopGroupReport.mockResolvedValue({
      group: {
        code: 'A',
        name: 'Group A',
        subjects: [
          { code: 'toan', name: 'Mathematics' },
          { code: 'vat_li', name: 'Physics' },
          { code: 'hoa_hoc', name: 'Chemistry' },
        ],
      },
      items: [
        {
          rank: 1,
          registrationNumber: '01000001',
          examTrack: 'NATURAL',
          totalScore: 28,
          scores: [],
        },
      ],
    });

    await request(app.getHttpServer())
      .get('/api/v1/reports/top-groups/A?limit=10')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.group.code).toBe('A');
        expect(body.data.items[0].registrationNumber).toBe('01000001');
      });

    expect(reportsService.getTopGroupReport).toHaveBeenCalledWith('A', 10);
  });

  it('rejects invalid subject code params', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/reports/score-levels/TOAN')
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          code: ERROR_CODE.VALIDATION_ERROR,
          message: 'Validation failed',
        });
      });
  });

  it('returns standard error envelope for missing subject', async () => {
    reportsService.getScoreDistribution.mockRejectedValue(
      new AppException({
        code: ERROR_CODE.SUBJECT_NOT_FOUND,
        message: 'Subject missing was not found',
      }),
    );

    await request(app.getHttpServer())
      .get('/api/v1/reports/score-distribution/missing')
      .expect(404)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          code: ERROR_CODE.SUBJECT_NOT_FOUND,
          message: 'Subject missing was not found',
        });
      });
  });
});

function createScoreLevelReport(subjectCode: string) {
  return {
    subject: {
      code: subjectCode,
      name: subjectCode,
    },
    levels: [
      {
        code: 'gte_8',
        label: '>= 8',
        minScore: 8,
        maxScore: null,
        count: 1,
      },
    ],
  };
}
