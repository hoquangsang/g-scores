import { Global, Inject, Injectable, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import {
  CacheService,
  MemoryCacheStore,
  NoopCacheStore,
  createRedisCacheStore,
  type CacheStore,
} from '@repo/cache';

import { ConfigModule, ConfigService } from '@/config';

import { API_CACHE_STORE } from './api-cache.constants';

type ManagedCacheStore = {
  close?: () => Promise<void>;
  store: CacheStore;
};

function createManagedCacheStore(configService: ConfigService): ManagedCacheStore {
  const logger = new Logger('ApiCache');
  const config = configService.cache;

  if (config.driver === 'none') {
    return {
      store: new NoopCacheStore(),
    };
  }

  if (config.driver === 'memory') {
    return {
      store: new MemoryCacheStore(),
    };
  }

  return createRedisCacheStore({
    keyPrefix: config.keyPrefix,
    logger: {
      warn(message, error) {
        logger.warn(message, error instanceof Error ? error.stack : undefined);
      },
    },
    url: config.redisUrl as string,
  });
}

@Injectable()
class ApiCacheLifecycle implements OnModuleDestroy {
  private readonly managedStore: ManagedCacheStore;

  constructor(@Inject(API_CACHE_STORE) managedStore: ManagedCacheStore) {
    this.managedStore = managedStore;
  }

  async onModuleDestroy(): Promise<void> {
    await this.managedStore.close?.();
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: API_CACHE_STORE,
      inject: [ConfigService],
      useFactory: createManagedCacheStore,
    },
    {
      provide: CacheService,
      inject: [API_CACHE_STORE, ConfigService],
      useFactory: (managedStore: ManagedCacheStore, configService: ConfigService) =>
        new CacheService(managedStore.store, {
          defaultTtlSeconds: configService.cache.ttlSeconds,
        }),
    },
    ApiCacheLifecycle,
  ],
  exports: [CacheService],
})
export class ApiCacheModule {}
