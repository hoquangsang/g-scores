import { ExamTrack } from '@repo/database';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';

import { ReportsRepository } from '@/modules/reports/reports.repository';

import { createTestDatabaseClient, resetCandidateData } from '../../helpers/database';
import type { DatabaseService } from '@/database';
import type { DatabaseClient, Subject } from '@repo/database';

describe(ReportsRepository.name, () => {
  let db: DatabaseClient;
  let repository: ReportsRepository;
  let subjectsByCode: Map<string, Subject>;

  beforeAll(async () => {
    db = createTestDatabaseClient();
    repository = new ReportsRepository({ client: db } as DatabaseService);
    const subjects = await db.subject.findMany();
    subjectsByCode = new Map(subjects.map((subject) => [subject.code, subject]));
  });

  beforeEach(async () => {
    await resetCandidateData(db);
    await seedScoreRows();
  });

  afterAll(async () => {
    await db?.$disconnect();
  });

  it('counts score levels for all subjects', async () => {
    const reports = await repository.findScoreLevelReports();
    const mathReport = reports.find((report) => report.subject.code === 'toan');

    expect(mathReport?.levels).toEqual([
      expect.objectContaining({ code: 'gte_8', count: 3 }),
      expect.objectContaining({ code: 'gte_6_lt_8', count: 1 }),
      expect.objectContaining({ code: 'gte_4_lt_6', count: 0 }),
      expect.objectContaining({ code: 'lt_4', count: 1 }),
    ]);
  });

  it('returns dataset summary counts', async () => {
    await expect(repository.findReportSummary()).resolves.toEqual({
      subjectCount: subjectsByCode.size,
      candidateCount: 5,
    });
  });

  it('returns a single-subject score distribution', async () => {
    const distribution = await repository.findScoreDistribution('toan');

    expect(distribution).toMatchObject({
      subject: { code: 'toan', name: 'Mathematics' },
      items: [
        { score: 3.5, count: 1 },
        { score: 7, count: 1 },
        { score: 8, count: 1 },
        { score: 9, count: 1 },
        { score: 10, count: 1 },
      ],
    });
  });

  it('ranks only candidates with all group subjects', async () => {
    const report = await repository.findTopGroupReport('A', 10);

    expect(report?.group.subjects.map((subject) => subject.code)).toEqual([
      'toan',
      'vat_li',
      'hoa_hoc',
    ]);
    expect(report?.items.map((item) => item.registrationNumber)).toEqual(['01000001', '01000003']);
    expect(report?.items[0]).toMatchObject({
      rank: 1,
      registrationNumber: '01000001',
      totalScore: 24,
      scores: [
        { subjectCode: 'toan', score: 9 },
        { subjectCode: 'vat_li', score: 8 },
        { subjectCode: 'hoa_hoc', score: 7 },
      ],
    });
  });

  it('returns null for unknown subject or group', async () => {
    await expect(repository.findScoreLevelReport('missing')).resolves.toBeNull();
    await expect(repository.findScoreDistribution('missing')).resolves.toBeNull();
    await expect(repository.findTopGroupReport('missing', 10)).resolves.toBeNull();
  });

  async function seedScoreRows(): Promise<void> {
    await createCandidateWithScores('01000001', ExamTrack.NATURAL, {
      toan: '9.00',
      vat_li: '8.00',
      hoa_hoc: '7.00',
    });
    await createCandidateWithScores('01000002', ExamTrack.NATURAL, {
      toan: '10.00',
      vat_li: '9.00',
    });
    await createCandidateWithScores('01000003', ExamTrack.NATURAL, {
      toan: '8.00',
      vat_li: '8.00',
      hoa_hoc: '8.00',
    });
    await createCandidateWithScores('01000004', ExamTrack.UNKNOWN, {
      toan: '7.00',
    });
    await createCandidateWithScores('01000005', ExamTrack.SOCIAL, {
      toan: '3.50',
      ngu_van: '6.00',
    });
  }

  async function createCandidateWithScores(
    registrationNumber: string,
    examTrack: ExamTrack,
    scoresBySubjectCode: Record<string, string>,
  ): Promise<void> {
    const candidate = await db.candidate.create({
      data: {
        registrationNumber,
        examTrack,
      },
    });

    await db.candidateScore.createMany({
      data: Object.entries(scoresBySubjectCode).map(([subjectCode, score]) => {
        const subject = subjectsByCode.get(subjectCode);

        if (!subject) {
          throw new Error(`Missing subject ${subjectCode}`);
        }

        return {
          candidateId: candidate.id,
          subjectId: subject.id,
          score,
        };
      }),
    });
  }
});
