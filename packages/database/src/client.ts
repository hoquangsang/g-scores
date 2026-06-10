import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from './generated/prisma/client';
import type { PrismaClient as PrismaClientInstance } from './generated/prisma/client';

export type CreateDatabaseClientOptions = {
  url: string;
};

export type DatabaseClient = PrismaClientInstance;
export type DatabaseTransaction = Prisma.TransactionClient;

export abstract class DatabaseClientProvider {
  abstract readonly client: DatabaseClient;
}

export const createDatabaseClient = ({ url }: CreateDatabaseClientOptions): DatabaseClient => {
  const adapter = new PrismaPg({
    connectionString: url,
  });

  return new PrismaClient({
    adapter,
  });
};
