import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ExamTrack } from '@repo/database';
import request from 'supertest';

import { AppException, ERROR_CODE } from '@/common/exceptions';
import { GlobalExceptionFilter } from '@/common/filters';
import { ScoresController } from '@/modules/scores/scores.controller';
import { ScoresService } from '@/modules/scores/scores.service';
import { setupApiRouting } from '@/setup';

describe(ScoresController.name, () => {
  let app: INestApplication;
  const scoresService = {
    getCandidateScoreDetail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ScoresController],
      providers: [
        {
          provide: ScoresService,
          useValue: scoresService,
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

  it('returns candidate score detail', async () => {
    scoresService.getCandidateScoreDetail.mockResolvedValue({
      registrationNumber: '01000001',
      examTrack: ExamTrack.NATURAL,
      foreignLanguage: { code: 'N1', name: 'English' },
      scores: [{ subjectCode: 'toan', subjectName: 'Mathematics', score: 8.4 }],
    });

    await request(app.getHttpServer())
      .get('/api/v1/scores/01000001')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toMatchObject({
          registrationNumber: '01000001',
          examTrack: ExamTrack.NATURAL,
          scores: [{ subjectCode: 'toan', score: 8.4 }],
        });
      });
  });

  it('returns standard not found error envelope', async () => {
    scoresService.getCandidateScoreDetail.mockRejectedValue(
      new AppException({
        code: ERROR_CODE.CANDIDATE_NOT_FOUND,
        message: 'Candidate 00000000 was not found',
      }),
    );

    await request(app.getHttpServer())
      .get('/api/v1/scores/00000000')
      .expect(404)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          code: ERROR_CODE.CANDIDATE_NOT_FOUND,
          message: 'Candidate 00000000 was not found',
        });
      });
  });

  it('rejects invalid registration numbers', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/scores/abc')
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          code: ERROR_CODE.VALIDATION_ERROR,
          message: 'Validation failed',
        });
      });
  });
});
