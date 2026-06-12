import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockClient = { id: 'api-client' };
const createApiClient = vi.fn(() => mockClient);
const getCandidateScore = vi.fn();
const getExamGroups = vi.fn();
const getScoreDistribution = vi.fn();
const getScoreLevelReport = vi.fn();
const getScoreLevelReports = vi.fn();
const getSubjects = vi.fn();
const getTopGroupReport = vi.fn();

vi.mock('@repo/api-client', () => ({
  createApiClient,
  getApiClientErrorMessage: (error: unknown) =>
    error instanceof Error ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.',
  getCandidateScore,
  getExamGroups,
  getScoreDistribution,
  getScoreLevelReport,
  getScoreLevelReports,
  getSubjects,
  getTopGroupReport,
}));

describe('web API adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates one typed API client from environment base URL', async () => {
    await import('../../src/lib/api');

    expect(createApiClient).toHaveBeenCalledWith({
      baseUrl: expect.any(String),
    });
  });

  it('delegates score and report calls to @repo/api-client', async () => {
    getCandidateScore.mockResolvedValue({
      registrationNumber: '01000001',
      examTrack: 'NATURAL',
      foreignLanguage: null,
      scores: [],
    });
    getScoreLevelReports.mockResolvedValue({ reports: [] });
    getTopGroupReport.mockResolvedValue({
      group: { code: 'A', name: 'Khối A', subjects: [] },
      items: [],
    });

    const api = await import('../../src/lib/api');

    await expect(api.getCandidateScore('01000001')).resolves.toMatchObject({
      registrationNumber: '01000001',
    });
    await expect(api.getScoreLevelReports()).resolves.toEqual({ reports: [] });
    await expect(api.getTopGroupReport('A', 10)).resolves.toMatchObject({
      group: { code: 'A' },
    });
    expect(getCandidateScore).toHaveBeenCalledWith(mockClient, '01000001');
    expect(getScoreLevelReports).toHaveBeenCalledWith(mockClient);
    expect(getTopGroupReport).toHaveBeenCalledWith(mockClient, 'A', 10);
  });

  it('delegates catalog and subject report calls to @repo/api-client', async () => {
    getSubjects.mockResolvedValue([{ code: 'toan', name: 'Toán' }]);
    getExamGroups.mockResolvedValue([{ code: 'A', name: 'Khối A', subjects: [] }]);
    getScoreLevelReport.mockResolvedValue({
      subject: { code: 'toan', name: 'Toán' },
      levels: [],
    });
    getScoreDistribution.mockResolvedValue({
      subject: { code: 'toan', name: 'Toán' },
      items: [],
    });

    const api = await import('../../src/lib/api');

    await expect(api.getSubjects()).resolves.toEqual([{ code: 'toan', name: 'Toán' }]);
    await expect(api.getExamGroups()).resolves.toEqual([
      { code: 'A', name: 'Khối A', subjects: [] },
    ]);
    await expect(api.getScoreLevelReport('toan')).resolves.toMatchObject({
      subject: { code: 'toan' },
    });
    await expect(api.getScoreDistribution('toan')).resolves.toMatchObject({
      subject: { code: 'toan' },
    });
  });
});
