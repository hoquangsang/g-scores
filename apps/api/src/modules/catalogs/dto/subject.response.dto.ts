import { ApiProperty } from '@nestjs/swagger';

export class SubjectResponseDto {
  @ApiProperty({ example: 'toan' })
  readonly code!: string;

  @ApiProperty({ example: 'Mathematics' })
  readonly name!: string;
}
