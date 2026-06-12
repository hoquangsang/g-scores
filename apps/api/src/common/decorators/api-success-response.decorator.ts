import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { SuccessResponse } from '@/common/responses';

export type ApiSuccessResponseDtoOptions = {
  readonly description?: string;
  readonly isArray?: boolean;
};

export function ApiSuccessResponseDto(
  dataDto: Type<unknown>,
  { description = 'Success', isArray = false }: ApiSuccessResponseDtoOptions = {},
): MethodDecorator {
  const dataSchema = isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(dataDto) },
      }
    : { $ref: getSchemaPath(dataDto) };

  return applyDecorators(
    ApiExtraModels(SuccessResponse, dataDto),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
}
