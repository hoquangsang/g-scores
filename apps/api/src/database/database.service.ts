import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DatabaseClientProvider, createDatabaseClient, type DatabaseClient } from '@repo/database';

import { ConfigService } from '@/config';

@Injectable()
export class DatabaseService
  extends DatabaseClientProvider
  implements OnModuleInit, OnModuleDestroy
{
  readonly client: DatabaseClient;

  constructor(configService: ConfigService) {
    super();
    this.client = createDatabaseClient({
      url: configService.db.url,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
