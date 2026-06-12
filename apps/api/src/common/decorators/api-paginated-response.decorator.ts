import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginatedResponse, PaginationMeta } from '@/common/responses';

export type ApiPaginatedResponseDtoOptions = {
  readonly description?: string;
};

export function ApiPaginatedResponseDto(
  itemDto: Type<unknown>,
  { description = 'Success' }: ApiPaginatedResponseDtoOptions = {},
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(PaginatedResponse, PaginationMeta, itemDto),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(itemDto) },
              },
              meta: {
                $ref: getSchemaPath(PaginationMeta),
              },
            },
          },
        ],
      },
    }),
  );
}
