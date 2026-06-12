import { ApiProperty } from '@nestjs/swagger';

import { SubjectResponseDto } from '@/modules/catalogs/dto/subject.response.dto';

export class ScoreDistributionItemResponseDto {
  @ApiProperty({ example: 8.2 })
  readonly score!: number;

  @ApiProperty({ example: 125 })
  readonly count!: number;
}

export class ScoreDistributionResponseDto {
  @ApiProperty({ type: SubjectResponseDto })
  readonly subject!: SubjectResponseDto;

  @ApiProperty({ type: [ScoreDistributionItemResponseDto] })
  readonly items!: ScoreDistributionItemResponseDto[];
}
