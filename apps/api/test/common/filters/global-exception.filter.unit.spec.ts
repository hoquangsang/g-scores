import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { describe, expect, it, jest } from '@jest/globals';

import { AppException, ERROR_CODE } from '@/common/exceptions';
import { GlobalExceptionFilter } from '@/common/filters';

describe(GlobalExceptionFilter.name, () => {
  it('converts AppException to standard error response', () => {
    const response = createResponseMock('req-123');
    const filter = new GlobalExceptionFilter();

    filter.catch(
      new AppException({
        code: ERROR_CODE.CANDIDATE_NOT_FOUND,
        message: 'Candidate was not found',
      }),
      createArgumentsHost(response),
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        code: ERROR_CODE.CANDIDATE_NOT_FOUND,
        message: 'Candidate was not found',
        requestId: 'req-123',
      }),
    );
  });

  it('converts validation HttpException messages to error details', () => {
    const response = createResponseMock();
    const filter = new GlobalExceptionFilter();

    filter.catch(
      new BadRequestException({
        message: ['subjectCode must be valid'],
      }),
      createArgumentsHost(response),
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: ERROR_CODE.VALIDATION_ERROR,
        message: 'Validation failed',
        errors: [{ message: 'subjectCode must be valid' }],
      }),
    );
  });

  it('hides unknown exception details', () => {
    const response = createResponseMock();
    const filter = new GlobalExceptionFilter();

    filter.catch(new Error('database exploded'), createArgumentsHost(response));

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }),
    );
  });
});

function createResponseMock(requestId?: string) {
  return {
    getHeader: jest.fn(() => requestId),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

function createArgumentsHost(response: ReturnType<typeof createResponseMock>): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  } as ArgumentsHost;
}
