import { ApiProperty } from '@nestjs/swagger';

import { SubjectResponseDto } from './subject.response.dto';

export class ExamGroupResponseDto {
  @ApiProperty({ example: 'A' })
  readonly code!: string;

  @ApiProperty({ example: 'Group A' })
  readonly name!: string;

  @ApiProperty({ type: [SubjectResponseDto] })
  readonly subjects!: SubjectResponseDto[];
}
