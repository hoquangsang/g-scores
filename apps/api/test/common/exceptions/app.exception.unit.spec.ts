import { describe, expect, it } from '@jest/globals';

import { AppException, ERROR_CODE, getHttpStatusForErrorCode } from '@/common/exceptions';

describe(AppException.name, () => {
  it('defaults to internal server error code', () => {
    const exception = new AppException({
      message: 'Unexpected error',
    });

    expect(exception).toMatchObject({
      name: 'AppException',
      message: 'Unexpected error',
      code: ERROR_CODE.INTERNAL_SERVER_ERROR,
    });
  });

  it('maps domain error codes to HTTP statuses', () => {
    expect(getHttpStatusForErrorCode(ERROR_CODE.CANDIDATE_NOT_FOUND)).toBe(404);
    expect(getHttpStatusForErrorCode(ERROR_CODE.SUBJECT_NOT_FOUND)).toBe(404);
    expect(getHttpStatusForErrorCode(ERROR_CODE.VALIDATION_ERROR)).toBe(400);
  });
});
