import type { ApiClient } from './client';
import { unwrapData } from './response';
import type { CandidateScoreDetail } from './types';

export function getCandidateScore(
  client: ApiClient,
  registrationNumber: string,
): Promise<CandidateScoreDetail> {
  return unwrapData(
    client.GET('/api/v1/scores/{registrationNumber}', {
      params: {
        path: {
          registrationNumber,
        },
      },
    }),
    'Failed to load candidate score',
  );
}
