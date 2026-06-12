import { ApiProperty } from '@nestjs/swagger';

export type PaginationMetaInput = {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
};

export class PaginationMeta {
  @ApiProperty({ example: 100 })
  readonly total: number;

  @ApiProperty({ example: 1 })
  readonly page: number;

  @ApiProperty({ example: 20 })
  readonly limit: number;

  @ApiProperty({ example: 5 })
  readonly totalPages: number;

  @ApiProperty({ example: true })
  readonly hasNextPage: boolean;

  @ApiProperty({ example: false })
  readonly hasPreviousPage: boolean;

  private constructor(input: PaginationMetaInput) {
    const page = Math.max(1, input.page);
    const limit = Math.max(1, input.limit);
    const total = Math.max(0, input.total);
    const totalPages = Math.ceil(total / limit);

    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = totalPages;
    this.hasNextPage = page < totalPages;
    this.hasPreviousPage = page > 1;
  }

  static of(input: PaginationMetaInput): PaginationMeta {
    return new PaginationMeta(input);
  }
}

export type PaginatedResponseInput<T> = {
  readonly data: T[];
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly message?: string;
};

export class PaginatedResponse<T> {
  @ApiProperty({ example: true })
  readonly success = true;

  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: PaginationMeta })
  readonly meta: PaginationMeta;

  @ApiProperty({ example: 'OK' })
  readonly message: string;

  @ApiProperty({ example: '2026-06-11T00:00:00.000Z' })
  readonly timestamp: string;

  private constructor({ data, page, limit, total, message = 'OK' }: PaginatedResponseInput<T>) {
    this.data = data;
    this.meta = PaginationMeta.of({ page, limit, total });
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  static of<T>(input: PaginatedResponseInput<T>): PaginatedResponse<T> {
    return new PaginatedResponse(input);
  }
}
