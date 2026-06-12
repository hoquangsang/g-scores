import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LookupScoreRequestDto {
  @ApiProperty({ example: '01000001' })
  @IsString()
  @Matches(/^\d+$/, {
    message: 'registrationNumber must contain digits only',
  })
  readonly registrationNumber!: string;
}
