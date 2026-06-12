import createOpenApiClient, { type Client } from 'openapi-fetch';

import type { paths } from './generated/openapi/types';

export type ApiClient = Client<paths>;

export type CreateApiClientOptions = {
  readonly baseUrl: string;
  readonly fetch?: typeof globalThis.fetch;
};

export function createApiClient({ baseUrl, fetch }: CreateApiClientOptions): ApiClient {
  return createOpenApiClient<paths>({
    baseUrl: baseUrl.replace(/\/$/, ''),
    fetch,
  });
}
