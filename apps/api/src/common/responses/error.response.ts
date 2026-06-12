import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type ErrorDetail = {
  readonly field?: string;
  readonly message: string;
  readonly code?: string;
};

export type ErrorResponseInput = {
  readonly message: string;
  readonly code: string;
  readonly errors?: ErrorDetail[];
  readonly requestId?: string;
};

export class ErrorResponse {
  @ApiProperty({ example: false })
  readonly success = false;

  @ApiProperty({ example: 'Validation failed' })
  readonly message: string;

  @ApiProperty({ example: 'VALIDATION_ERROR' })
  readonly code: string;

  @ApiPropertyOptional({
    example: [{ field: 'subject', message: 'subject must be a string' }],
  })
  readonly errors?: ErrorDetail[];

  @ApiProperty({ example: '2026-06-11T00:00:00.000Z' })
  readonly timestamp: string;

  @ApiPropertyOptional({ example: 'req-123' })
  readonly requestId?: string;

  private constructor({ message, code, errors, requestId }: ErrorResponseInput) {
    this.message = message;
    this.code = code;
    this.errors = errors;
    this.requestId = requestId;
    this.timestamp = new Date().toISOString();
  }

  static of(input: ErrorResponseInput): ErrorResponse {
    return new ErrorResponse(input);
  }
}
