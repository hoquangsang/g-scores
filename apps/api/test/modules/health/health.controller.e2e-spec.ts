import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';

import { HealthController } from '@/modules/health/health.controller';
import { setupApiRouting } from '@/setup';

describe(HealthController.name, () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    app = moduleRef.createNestApplication();
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

  it('returns neutral health endpoint outside API prefix', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.message).toBe('OK');
        expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');
        expect(body.data.status).toBe('ok');
        expect(body.data.service).toBe('g-scores-api');
        expect(body.data.uptime).toEqual(expect.any(Number));
        expect(body.data.uptime).toBeGreaterThanOrEqual(0);
        expect(body.data.timestamp).toBeUndefined();
      });
  });
});
