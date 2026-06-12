import { ApiProperty } from '@nestjs/swagger';

export type SuccessResponseInput<T> = {
  readonly data: T;
  readonly message?: string;
};

export class SuccessResponse<T> {
  @ApiProperty({ type: Boolean, example: true })
  readonly success = true;

  @ApiProperty()
  readonly data: T;

  @ApiProperty({ example: 'OK' })
  readonly message: string;

  @ApiProperty({ example: '2026-06-11T00:00:00.000Z' })
  readonly timestamp: string;

  private constructor({ data, message = 'OK' }: SuccessResponseInput<T>) {
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  static of<T>(input: SuccessResponseInput<T>): SuccessResponse<T> {
    return new SuccessResponse(input);
  }
}
