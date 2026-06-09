import { Controller, Get } from '@nestjs/common';

type HealthResponse = {
  readonly status: 'ok';
  readonly service: 'g-scores-api';
  readonly timestamp: string;
};

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'g-scores-api',
      timestamp: new Date().toISOString(),
    };
  }
}
