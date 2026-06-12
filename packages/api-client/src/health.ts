import type { ApiClient } from './client';
import { unwrapData } from './response';
import type { HealthResponse } from './types';

export async function getHealth(client: ApiClient): Promise<HealthResponse> {
  return unwrapData(client.GET('/health'), 'Failed to load health');
}
