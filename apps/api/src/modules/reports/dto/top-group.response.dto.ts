import { ApiProperty } from '@nestjs/swagger';
import { ExamTrack } from '@repo/database';

import { ExamGroupResponseDto } from '@/modules/catalogs/dto/exam-group.response.dto';

export class TopGroupCandidateScoreResponseDto {
  @ApiProperty({ example: 'toan' })
  readonly subjectCode!: string;

  @ApiProperty({ example: 'Mathematics' })
  readonly subjectName!: string;

  @ApiProperty({ example: 9.4 })
  readonly score!: number;
}

export class TopGroupCandidateResponseDto {
  @ApiProperty({ example: 1 })
  readonly rank!: number;

  @ApiProperty({ example: '01000001' })
  readonly registrationNumber!: string;

  @ApiProperty({ enum: ExamTrack, example: ExamTrack.NATURAL })
  readonly examTrack!: ExamTrack;

  @ApiProperty({ example: 28.4 })
  readonly totalScore!: number;

  @ApiProperty({ type: [TopGroupCandidateScoreResponseDto] })
  readonly scores!: TopGroupCandidateScoreResponseDto[];
}

export class TopGroupReportResponseDto {
  @ApiProperty({ type: ExamGroupResponseDto })
  readonly group!: ExamGroupResponseDto;

  @ApiProperty({ type: [TopGroupCandidateResponseDto] })
  readonly items!: TopGroupCandidateResponseDto[];
}
