import { Global, Module } from '@nestjs/common';
import { DatabaseClientProvider } from '@repo/database';
import { ConfigModule } from '@/config';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DatabaseService,
    {
      provide: DatabaseClientProvider,
      useExisting: DatabaseService,
    },
  ],
  exports: [DatabaseService, DatabaseClientProvider],
})
export class DatabaseModule {}
