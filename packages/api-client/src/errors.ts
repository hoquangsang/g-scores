export class ApiClientError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor({
    message,
    status,
    details,
  }: {
    readonly message: string;
    readonly status: number;
    readonly details?: unknown;
  }) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

export function getApiClientErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

export function createApiClientError({
  error,
  response,
  fallbackMessage,
}: {
  readonly error: unknown;
  readonly response?: Response;
  readonly fallbackMessage: string;
}): ApiClientError {
  return new ApiClientError({
    message: readErrorMessage(error) ?? fallbackMessage,
    status: response?.status ?? 0,
    details: error,
  });
}

function readErrorMessage(error: unknown): string | undefined {
  if (typeof error === 'string') {
    return error;
  }

  if (!error || typeof error !== 'object') {
    return undefined;
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }

  if ('error' in error && error.error && typeof error.error === 'object') {
    const nestedError = error.error;

    if ('message' in nestedError && typeof nestedError.message === 'string') {
      return nestedError.message;
    }
  }

  return undefined;
}
