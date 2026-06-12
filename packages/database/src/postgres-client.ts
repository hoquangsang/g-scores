import { Client } from 'pg';

export type PostgresClient = Client;

export type CreatePostgresClientOptions = {
  url: string;
};

export function createPostgresClient({ url }: CreatePostgresClientOptions): Client {
  return new Client({
    connectionString: url,
  });
}
