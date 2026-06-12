import { Module } from '@nestjs/common';

import { ApiCacheModule } from './common/cache';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { CatalogsModule } from './modules/catalogs';
import { HealthModule } from './modules/health';
import { ReportsModule } from './modules/reports';
import { ScoresModule } from './modules/scores';

@Module({
  imports: [
    ConfigModule,
    ApiCacheModule,
    DatabaseModule,
    HealthModule,
    CatalogsModule,
    ScoresModule,
    ReportsModule,
  ],
})
export class AppModule {}
