import { Module } from '@nestjs/common';

import { ScoresController } from './scores.controller';
import { ScoresRepository } from './scores.repository';
import { ScoresService } from './scores.service';

@Module({
  controllers: [ScoresController],
  providers: [ScoresRepository, ScoresService],
})
export class ScoresModule {}
