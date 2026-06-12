import { ApiProperty } from '@nestjs/swagger';

import { SubjectResponseDto } from '@/modules/catalogs/dto/subject.response.dto';

export class ScoreLevelResponseDto {
  @ApiProperty({ example: 'gte_8' })
  readonly code!: string;

  @ApiProperty({ example: '>= 8' })
  readonly label!: string;

  @ApiProperty({ type: Number, example: 8, nullable: true })
  readonly minScore!: number | null;

  @ApiProperty({ type: Number, example: null, nullable: true })
  readonly maxScore!: number | null;

  @ApiProperty({ example: 1250 })
  readonly count!: number;
}

export class ScoreLevelReportResponseDto {
  @ApiProperty({ type: SubjectResponseDto })
  readonly subject!: SubjectResponseDto;

  @ApiProperty({ type: [ScoreLevelResponseDto] })
  readonly levels!: ScoreLevelResponseDto[];
}

export class ScoreLevelReportsResponseDto {
  @ApiProperty({ type: [ScoreLevelReportResponseDto] })
  readonly reports!: ScoreLevelReportResponseDto[];
}
