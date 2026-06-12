import { HttpStatus } from '@nestjs/common';

import { ERROR_CODE, type ErrorCode } from './error-code';

const HTTP_STATUS_BY_ERROR_CODE: Partial<Record<ErrorCode, HttpStatus>> = {
  [ERROR_CODE.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
  [ERROR_CODE.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
  [ERROR_CODE.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ERROR_CODE.CANDIDATE_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ERROR_CODE.SUBJECT_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ERROR_CODE.EXAM_GROUP_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};

export function getHttpStatusForErrorCode(code: ErrorCode): HttpStatus {
  return HTTP_STATUS_BY_ERROR_CODE[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
}
