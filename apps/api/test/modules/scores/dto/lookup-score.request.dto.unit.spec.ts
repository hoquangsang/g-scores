import { describe, expect, it } from '@jest/globals';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { LookupScoreRequestDto } from '@/modules/scores/dto/lookup-score.request.dto';

describe(LookupScoreRequestDto.name, () => {
  it('accepts digit-only registration numbers', async () => {
    const dto = plainToInstance(LookupScoreRequestDto, {
      registrationNumber: '01000001',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects non-digit registration numbers', async () => {
    const dto = plainToInstance(LookupScoreRequestDto, {
      registrationNumber: 'abc',
    });

    await expect(validate(dto)).resolves.toEqual([
      expect.objectContaining({
        property: 'registrationNumber',
      }),
    ]);
  });
});
