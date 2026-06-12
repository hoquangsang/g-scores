import { ERROR_CODE, type ErrorCode } from './error-code';
import type { ErrorDetail } from '@/common/responses';

export type AppExceptionInput = {
  readonly message: string;
  readonly code?: ErrorCode;
  readonly details?: ErrorDetail[];
};

export class AppException extends Error {
  readonly code: ErrorCode;
  readonly details?: ErrorDetail[];

  constructor({ message, code = ERROR_CODE.INTERNAL_SERVER_ERROR, details }: AppExceptionInput) {
    super(message);
    this.name = 'AppException';
    this.code = code;
    this.details = details;
  }
}
