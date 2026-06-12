import { describe, expect, it, jest } from '@jest/globals';

import { ConfigService } from '@/config';
import { DatabaseService } from '@/database/database.service';

const connect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
const disconnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);

jest.mock('@repo/database', () => ({
  DatabaseClientProvider: class DatabaseClientProvider {},
  createDatabaseClient: jest.fn(() => ({
    $connect: connect,
    $disconnect: disconnect,
  })),
}));

describe(DatabaseService.name, () => {
  it('creates a database client from configured URL', () => {
    const service = new DatabaseService({
      db: {
        url: 'postgresql://postgres:postgres@localhost:5432/g_scores',
      },
    } as ConfigService);

    expect(service.client).toBeDefined();
  });

  it('connects and disconnects through lifecycle hooks', async () => {
    const service = new DatabaseService({
      db: {
        url: 'postgresql://postgres:postgres@localhost:5432/g_scores',
      },
    } as ConfigService);

    await service.onModuleInit();
    await service.onModuleDestroy();

    expect(connect).toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalled();
  });
});
