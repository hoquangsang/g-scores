import { describe, expect, it, vi } from 'vitest';

import { createApiClient } from '../src/client';
import { ApiClientError } from '../src/errors';
import {
  getReportSummary,
  getScoreDistribution,
  getScoreLevelReports,
  getTopGroupReport,
} from '../src/reports';

describe('api-client report integration helpers', () => {
  it('calls typed report endpoints and unwraps their data', async () => {
    const fetch = vi.fn(async (input: Parameters<typeof globalThis.fetch>[0]) => {
      const url = readRequestUrl(input);

      if (url.endsWith('/api/v1/reports/score-levels')) {
        return jsonResponse({
          success: true,
          data: {
            reports: [
              {
                subject: { code: 'toan', name: 'Toán' },
                levels: [{ code: 'gte_8', label: '>= 8', minScore: 8, maxScore: null, count: 10 }],
              },
            ],
          },
          message: 'OK',
          timestamp: '2026-06-11T00:00:00.000Z',
        });
      }

      if (url.endsWith('/api/v1/reports/summary')) {
        return jsonResponse({
          success: true,
          data: {
            subjectCount: 9,
            candidateCount: 5,
          },
          message: 'OK',
          timestamp: '2026-06-11T00:00:00.000Z',
        });
      }

      if (url.endsWith('/api/v1/reports/score-distribution/toan')) {
        return jsonResponse({
          success: true,
          data: {
            subject: { code: 'toan', name: 'Toán' },
            items: [{ score: 8.4, count: 3 }],
          },
          message: 'OK',
          timestamp: '2026-06-11T00:00:00.000Z',
        });
      }

      if (url.endsWith('/api/v1/reports/top-groups/A?limit=10')) {
        return jsonResponse({
          success: true,
          data: {
            group: {
              code: 'A',
              name: 'Khối A',
              subjects: [
                { code: 'toan', name: 'Toán' },
                { code: 'vat_li', name: 'Vật lí' },
                { code: 'hoa_hoc', name: 'Hóa học' },
              ],
            },
            items: [
              {
                rank: 1,
                registrationNumber: '01000001',
                examTrack: 'NATURAL',
                totalScore: 28.4,
                scores: [
                  { subjectCode: 'toan', subjectName: 'Toán', score: 9.4 },
                  { subjectCode: 'vat_li', subjectName: 'Vật lí', score: 9.5 },
                  { subjectCode: 'hoa_hoc', subjectName: 'Hóa học', score: 9.5 },
                ],
              },
            ],
          },
          message: 'OK',
          timestamp: '2026-06-11T00:00:00.000Z',
        });
      }

      return jsonResponse({ message: 'Not found' }, 404);
    }) as unknown as typeof globalThis.fetch;
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getScoreLevelReports(client)).resolves.toMatchObject({
      reports: [{ subject: { code: 'toan' } }],
    });
    await expect(getReportSummary(client)).resolves.toEqual({
      subjectCount: 9,
      candidateCount: 5,
    });
    await expect(getScoreDistribution(client, 'toan')).resolves.toMatchObject({
      subject: { code: 'toan' },
      items: [{ score: 8.4, count: 3 }],
    });
    await expect(getTopGroupReport(client, 'A', 10)).resolves.toMatchObject({
      group: { code: 'A' },
      items: [{ rank: 1, registrationNumber: '01000001' }],
    });
  });

  it('maps BE error envelopes to ApiClientError', async () => {
    const fetch = vi.fn(async () =>
      jsonResponse(
        {
          success: false,
          message: 'Subject missing was not found',
          code: 'SUBJECT_NOT_FOUND',
        },
        404,
      ),
    ) as unknown as typeof globalThis.fetch;
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getScoreDistribution(client, 'missing')).rejects.toMatchObject({
      name: ApiClientError.name,
      message: 'Subject missing was not found',
      status: 404,
    });
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  });
}

function readRequestUrl(input: Parameters<typeof globalThis.fetch>[0]): string {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}
