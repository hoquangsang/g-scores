import { Injectable } from '@nestjs/common';

import { appConfig, type AppConfig } from './app.config';
import { cacheConfig, type CacheConfig } from './cache.config';
import { dbConfig, type DbConfig } from './db.config';

@Injectable()
export class ConfigService {
  readonly app: AppConfig = appConfig;
  readonly cache: CacheConfig = cacheConfig;
  readonly db: DbConfig = dbConfig;

  get isProduction(): boolean {
    return this.app.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.app.nodeEnv === 'development';
  }
}
