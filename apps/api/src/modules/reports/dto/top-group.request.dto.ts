import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class TopGroupRequestDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'groupCode must be a valid exam group code',
  })
  readonly groupCode!: string;
}
