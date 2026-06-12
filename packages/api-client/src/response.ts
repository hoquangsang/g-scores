import { ApiClientError, createApiClientError } from './errors';
import type { SuccessEnvelope } from './types';

export type ApiClientResult<TData> = {
  readonly data?: SuccessEnvelope<TData>;
  readonly error?: unknown;
  readonly response: Response;
};

export async function unwrapData<TData>(
  resultPromise: Promise<ApiClientResult<TData>>,
  fallbackMessage = 'API request failed',
): Promise<TData> {
  const result = await resultPromise;

  if (result.error) {
    throw createApiClientError({
      error: result.error,
      response: result.response,
      fallbackMessage,
    });
  }

  if (!result.data || result.data.data === undefined) {
    throw new ApiClientError({
      message: 'Invalid API response',
      status: result.response.status,
      details: result.data,
    });
  }

  return result.data.data;
}
