import { Injectable } from '@nestjs/common';
import { CacheService, createCacheKey } from '@repo/cache';

import { AppException, ERROR_CODE } from '@/common/exceptions';
import { getSubjectOrderIndex } from '@/modules/catalogs/catalog.constants';

import { ReportsRepository } from './reports.repository';
import type {
  ReportSummary,
  ScoreDistribution,
  ScoreLevelReport,
  ScoreLevelReports,
  TopGroupReport,
} from './reports.types';

@Injectable()
export class ReportsService {
  private readonly cacheService: CacheService;
  private readonly reportsRepository: ReportsRepository;

  constructor(reportsRepository: ReportsRepository, cacheService: CacheService) {
    this.reportsRepository = reportsRepository;
    this.cacheService = cacheService;
  }

  async getReportSummary(): Promise<ReportSummary> {
    return this.cacheService.remember(createCacheKey('reports', 'summary'), () =>
      this.reportsRepository.findReportSummary(),
    );
  }

  async getScoreLevelReports(): Promise<ScoreLevelReports> {
    const reports = await this.cacheService.remember(
      createCacheKey('reports', 'score-levels', 'all'),
      () => this.reportsRepository.findScoreLevelReports(),
    );

    return {
      reports: reports.toSorted(
        (left, right) =>
          getSubjectOrderIndex(left.subject.code) - getSubjectOrderIndex(right.subject.code) ||
          left.subject.code.localeCompare(right.subject.code),
      ),
    };
  }

  async getScoreLevelReport(subjectCode: string): Promise<ScoreLevelReport> {
    const report = await this.cacheService.remember(
      createCacheKey('reports', 'score-levels', 'subject', subjectCode),
      () => this.reportsRepository.findScoreLevelReport(subjectCode),
    );

    if (!report) {
      throw new AppException({
        code: ERROR_CODE.SUBJECT_NOT_FOUND,
        message: `Subject ${subjectCode} was not found`,
      });
    }

    return report;
  }

  async getScoreDistribution(subjectCode: string): Promise<ScoreDistribution> {
    const distribution = await this.cacheService.remember(
      createCacheKey('reports', 'score-distribution', 'subject', subjectCode),
      () => this.reportsRepository.findScoreDistribution(subjectCode),
    );

    if (!distribution) {
      throw new AppException({
        code: ERROR_CODE.SUBJECT_NOT_FOUND,
        message: `Subject ${subjectCode} was not found`,
      });
    }

    return distribution;
  }

  async getTopGroupReport(groupCode: string, limit: number): Promise<TopGroupReport> {
    const normalizedGroupCode = groupCode.toUpperCase();
    const report = await this.cacheService.remember(
      createCacheKey('reports', 'top-group', normalizedGroupCode, 'limit', limit),
      () => this.reportsRepository.findTopGroupReport(normalizedGroupCode, limit),
    );

    if (!report) {
      throw new AppException({
        code: ERROR_CODE.EXAM_GROUP_NOT_FOUND,
        message: `Exam group ${normalizedGroupCode} was not found`,
      });
    }

    return report;
  }
}
