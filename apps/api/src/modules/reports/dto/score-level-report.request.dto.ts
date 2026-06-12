import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class ScoreLevelReportRequestDto {
  @ApiProperty({ example: 'toan' })
  @IsString()
  @Matches(/^[a-z0-9_]+$/, {
    message: 'subjectCode must be a valid subject code',
  })
  readonly subjectCode!: string;
}
