import { describe, expect, it, vi } from 'vitest';

import { createApiClient } from '../src/client';
import { getExamGroups, getSubjects } from '../src/catalogs';
import { ApiClientError, getApiClientErrorMessage } from '../src/errors';
import { getHealth } from '../src/health';
import {
  getReportSummary,
  getScoreDistribution,
  getScoreLevelReport,
  getTopGroupReport,
} from '../src/reports';
import { getCandidateScore } from '../src/scores';

describe('api-client score helpers', () => {
  it('unwraps success envelope data', async () => {
    const fetch = createJsonFetch({
      success: true,
      data: {
        registrationNumber: '01000001',
        examTrack: 'NATURAL',
        foreignLanguage: null,
        scores: [{ subjectCode: 'toan', subjectName: 'Toán', score: 8.4 }],
      },
      message: 'OK',
      timestamp: '2026-06-11T00:00:00.000Z',
    });
    const client = createApiClient({ baseUrl: 'https://api.example.test/', fetch });

    const result = await getCandidateScore(client, '01000001');

    expect(result.registrationNumber).toBe('01000001');
    expect(result.scores).toHaveLength(1);
    expect(readFetchUrl(fetch)).toBe('https://api.example.test/api/v1/scores/01000001');
  });

  it('throws ApiClientError for API errors', async () => {
    const fetch = createJsonFetch(
      {
        success: false,
        error: {
          message: 'Candidate not found',
        },
      },
      404,
    );
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getCandidateScore(client, '00000000')).rejects.toMatchObject({
      name: ApiClientError.name,
      message: 'Candidate not found',
      status: 404,
    });
  });

  it('returns safe error messages for unknown thrown values', () => {
    expect(getApiClientErrorMessage('boom')).toBe('Đã có lỗi xảy ra. Vui lòng thử lại.');
    expect(getApiClientErrorMessage(new Error('Network failed'))).toBe('Network failed');
  });

  it('loads health response from success envelope', async () => {
    const fetch = createJsonFetch({
      success: true,
      data: {
        status: 'ok',
        service: 'g-scores-api',
        uptime: 12.34,
      },
      message: 'OK',
      timestamp: '2026-06-11T00:00:00.000Z',
    });
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getHealth(client)).resolves.toMatchObject({
      status: 'ok',
      service: 'g-scores-api',
    });
    expect(readFetchUrl(fetch)).toBe('https://api.example.test/health');
  });

  it('loads catalog helpers', async () => {
    const fetch = createJsonFetch({
      success: true,
      data: [{ code: 'toan', name: 'Toán' }],
      message: 'OK',
      timestamp: '2026-06-11T00:00:00.000Z',
    });
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getSubjects(client)).resolves.toEqual([{ code: 'toan', name: 'Toán' }]);
    expect(readFetchUrl(fetch)).toBe('https://api.example.test/api/v1/catalogs/subjects');
  });

  it('loads exam group catalogs', async () => {
    const fetch = createJsonFetch({
      success: true,
      data: [{ code: 'A', name: 'Khối A', subjects: [] }],
      message: 'OK',
      timestamp: '2026-06-11T00:00:00.000Z',
    });
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getExamGroups(client)).resolves.toEqual([
      { code: 'A', name: 'Khối A', subjects: [] },
    ]);
    expect(readFetchUrl(fetch)).toBe('https://api.example.test/api/v1/catalogs/exam-groups');
  });

  it('loads single subject reports and distributions', async () => {
    const fetch = createJsonFetch({
      success: true,
      data: {
        subject: { code: 'toan', name: 'Toán' },
        levels: [],
      },
      message: 'OK',
      timestamp: '2026-06-11T00:00:00.000Z',
    });
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getScoreLevelReport(client, 'toan')).resolves.toMatchObject({
      subject: { code: 'toan' },
    });
    expect(readFetchUrl(fetch)).toBe('https://api.example.test/api/v1/reports/score-levels/toan');
  });

  it('loads report summary', async () => {
    const fetch = createJsonFetch({
      success: true,
      data: {
        subjectCount: 9,
        candidateCount: 5,
      },
      message: 'OK',
      timestamp: '2026-06-11T00:00:00.000Z',
    });
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getReportSummary(client)).resolves.toEqual({
      subjectCount: 9,
      candidateCount: 5,
    });
    expect(readFetchUrl(fetch)).toBe('https://api.example.test/api/v1/reports/summary');
  });

  it('passes report query params through generated paths', async () => {
    const fetch = createJsonFetch({
      success: true,
      data: {
        group: { code: 'A', name: 'Khối A', subjects: [] },
        items: [],
      },
      message: 'OK',
      timestamp: '2026-06-11T00:00:00.000Z',
    });
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getTopGroupReport(client, 'A', 25)).resolves.toMatchObject({
      group: { code: 'A' },
    });
    expect(readFetchUrl(fetch)).toBe(
      'https://api.example.test/api/v1/reports/top-groups/A?limit=25',
    );
  });

  it('throws for invalid envelope responses', async () => {
    const fetch = createJsonFetch({
      success: true,
      message: 'OK',
      timestamp: '2026-06-11T00:00:00.000Z',
    });
    const client = createApiClient({ baseUrl: 'https://api.example.test', fetch });

    await expect(getScoreDistribution(client, 'toan')).rejects.toMatchObject({
      name: ApiClientError.name,
      message: 'Invalid API response',
    });
  });
});

function createJsonFetch(body: unknown, status = 200): typeof fetch {
  return vi.fn(async () => {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        'content-type': 'application/json',
      },
    });
  }) as unknown as typeof fetch;
}

function readFetchUrl(fetch: typeof globalThis.fetch): string {
  const mock = vi.mocked(fetch);
  const input = mock.mock.calls[0]?.[0];

  if (!input) {
    return '';
  }

  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}
