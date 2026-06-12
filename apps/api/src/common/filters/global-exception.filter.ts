import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

import {
  AppException,
  ERROR_CODE,
  getHttpStatusForErrorCode,
  type ErrorCode,
} from '@/common/exceptions';
import { ErrorResponse, type ErrorDetail } from '@/common/responses';

const HTTP_ERROR_CODE_BY_STATUS: Partial<Record<HttpStatus, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: ERROR_CODE.BAD_REQUEST,
  [HttpStatus.NOT_FOUND]: ERROR_CODE.NOT_FOUND,
  [HttpStatus.INTERNAL_SERVER_ERROR]: ERROR_CODE.INTERNAL_SERVER_ERROR,
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): unknown {
    const response = host.switchToHttp().getResponse<Response>();
    const requestId = this.getRequestId(response);

    if (exception instanceof AppException) {
      return response.status(getHttpStatusForErrorCode(exception.code)).json(
        ErrorResponse.of({
          message: exception.message,
          code: exception.code,
          errors: exception.details,
          requestId,
        }),
      );
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, response, requestId);
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      ErrorResponse.of({
        message: 'Internal server error',
        code: ERROR_CODE.INTERNAL_SERVER_ERROR,
        requestId,
      }),
    );
  }

  private handleHttpException(
    exception: HttpException,
    response: Response,
    requestId?: string,
  ): unknown {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const fallbackCode = this.getDefaultCode(status);

    if (typeof exceptionResponse === 'string') {
      return response.status(status).json(
        ErrorResponse.of({
          message: exceptionResponse,
          code: fallbackCode,
          requestId,
        }),
      );
    }

    if (this.isRecord(exceptionResponse)) {
      return response.status(status).json(
        ErrorResponse.of({
          message: this.getHttpExceptionMessage(exceptionResponse),
          code: this.getHttpExceptionCode(exceptionResponse, fallbackCode),
          errors: this.getHttpExceptionDetails(exceptionResponse),
          requestId,
        }),
      );
    }

    return response.status(status).json(
      ErrorResponse.of({
        message: 'Internal server error',
        code: fallbackCode,
        requestId,
      }),
    );
  }

  private getHttpExceptionMessage(response: Record<string, unknown>): string {
    if (typeof response.message === 'string') {
      return response.message;
    }

    if (Array.isArray(response.message)) {
      return 'Validation failed';
    }

    if (typeof response.error === 'string') {
      return response.error;
    }

    return 'Internal server error';
  }

  private getHttpExceptionCode(
    response: Record<string, unknown>,
    fallbackCode: ErrorCode,
  ): ErrorCode {
    if (typeof response.code === 'string' && this.isErrorCode(response.code)) {
      return response.code;
    }

    if (Array.isArray(response.message)) {
      return ERROR_CODE.VALIDATION_ERROR;
    }

    return fallbackCode;
  }

  private getHttpExceptionDetails(response: Record<string, unknown>): ErrorDetail[] | undefined {
    if (Array.isArray(response.errors)) {
      const details = response.errors.filter(this.isErrorDetail);
      return details.length > 0 ? details : undefined;
    }

    if (Array.isArray(response.message)) {
      const details = response.message
        .filter((message): message is string => typeof message === 'string')
        .map((message) => ({ message }));

      return details.length > 0 ? details : undefined;
    }

    return undefined;
  }

  private getDefaultCode(status: number): ErrorCode {
    return HTTP_ERROR_CODE_BY_STATUS[status as HttpStatus] ?? ERROR_CODE.INTERNAL_SERVER_ERROR;
  }

  private getRequestId(response: Response): string | undefined {
    const header = response.getHeader('x-request-id');

    if (typeof header === 'string') {
      return header;
    }

    if (typeof header === 'number') {
      return String(header);
    }

    return undefined;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isErrorDetail(value: unknown): value is ErrorDetail {
    return this.isRecord(value) && typeof value.message === 'string';
  }

  private isErrorCode(value: string): value is ErrorCode {
    return Object.values(ERROR_CODE).includes(value as ErrorCode);
  }
}
