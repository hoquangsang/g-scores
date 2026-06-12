import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ApiSuccessResponseDto } from '@/common/decorators';
import { SuccessResponse } from '@/common/responses';

import { ReportSummaryResponseDto } from './dto/report-summary.response.dto';
import { ScoreDistributionResponseDto } from './dto/score-distribution.response.dto';
import { ScoreLevelReportRequestDto } from './dto/score-level-report.request.dto';
import {
  ScoreLevelReportResponseDto,
  ScoreLevelReportsResponseDto,
} from './dto/score-level-report.response.dto';
import { TopGroupQueryDto } from './dto/top-group.query.dto';
import { TopGroupRequestDto } from './dto/top-group.request.dto';
import { TopGroupReportResponseDto } from './dto/top-group.response.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller({
  path: 'reports',
  version: '1',
})
export class ReportsController {
  private readonly reportsService: ReportsService;

  constructor(reportsService: ReportsService) {
    this.reportsService = reportsService;
  }

  @Get('summary')
  @ApiSuccessResponseDto(ReportSummaryResponseDto, {
    description: 'Dataset summary for reports dashboard',
  })
  async getReportSummary(): Promise<SuccessResponse<ReportSummaryResponseDto>> {
    const summary = await this.reportsService.getReportSummary();
    return SuccessResponse.of({ data: summary });
  }

  @Get('score-levels')
  @ApiSuccessResponseDto(ScoreLevelReportsResponseDto, {
    description: 'Score level reports by all subjects',
  })
  async getScoreLevelReports(): Promise<SuccessResponse<ScoreLevelReportsResponseDto>> {
    const reports = await this.reportsService.getScoreLevelReports();
    return SuccessResponse.of({ data: reports });
  }

  @Get('score-levels/:subjectCode')
  @ApiParam({ name: 'subjectCode', example: 'toan' })
  @ApiSuccessResponseDto(ScoreLevelReportResponseDto, {
    description: 'Score level report by subject',
  })
  async getScoreLevelReport(
    @Param() params: ScoreLevelReportRequestDto,
  ): Promise<SuccessResponse<ScoreLevelReportResponseDto>> {
    const report = await this.reportsService.getScoreLevelReport(params.subjectCode);
    return SuccessResponse.of({ data: report });
  }

  @Get('score-distribution/:subjectCode')
  @ApiParam({ name: 'subjectCode', example: 'toan' })
  @ApiSuccessResponseDto(ScoreDistributionResponseDto, {
    description: 'Score distribution by subject',
  })
  async getScoreDistribution(
    @Param() params: ScoreLevelReportRequestDto,
  ): Promise<SuccessResponse<ScoreDistributionResponseDto>> {
    const distribution = await this.reportsService.getScoreDistribution(params.subjectCode);
    return SuccessResponse.of({ data: distribution });
  }

  @Get('top-groups/:groupCode')
  @ApiParam({ name: 'groupCode', example: 'A' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiSuccessResponseDto(TopGroupReportResponseDto, {
    description: 'Top candidates by exam group',
  })
  async getTopGroupReport(
    @Param() params: TopGroupRequestDto,
    @Query() query: TopGroupQueryDto,
  ): Promise<SuccessResponse<TopGroupReportResponseDto>> {
    const report = await this.reportsService.getTopGroupReport(params.groupCode, query.limit);
    return SuccessResponse.of({ data: report });
  }
}
