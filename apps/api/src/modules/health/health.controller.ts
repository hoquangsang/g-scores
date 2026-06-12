import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import { ApiSuccessResponseDto } from '@/common/decorators';
import { SuccessResponse } from '@/common/responses';

class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  readonly status!: 'ok';

  @ApiProperty({ example: 'g-scores-api' })
  readonly service!: 'g-scores-api';

  @ApiProperty({ example: 12.34 })
  readonly uptime!: number;
}

@ApiTags('Health')
@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
export class HealthController {
  @Get()
  @ApiSuccessResponseDto(HealthResponseDto, {
    description: 'API health status',
  })
  getHealth(): SuccessResponse<HealthResponseDto> {
    return SuccessResponse.of({
      data: {
        status: 'ok',
        service: 'g-scores-api',
        uptime: Number(process.uptime().toFixed(2)),
      },
    });
  }
}
