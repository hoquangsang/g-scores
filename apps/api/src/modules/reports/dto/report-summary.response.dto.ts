import { ApiProperty } from '@nestjs/swagger';

export class ReportSummaryResponseDto {
  @ApiProperty({ example: 9 })
  readonly subjectCount!: number;

  @ApiProperty({ example: 1062801 })
  readonly candidateCount!: number;
}
