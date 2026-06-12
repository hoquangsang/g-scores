import { describe, expect, it } from '@jest/globals';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { TopGroupRequestDto } from '@/modules/reports/dto/top-group.request.dto';

describe(TopGroupRequestDto.name, () => {
  it('accepts alphanumeric group codes', async () => {
    const dto = plainToInstance(TopGroupRequestDto, {
      groupCode: 'A1',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects unsafe group codes', async () => {
    const dto = plainToInstance(TopGroupRequestDto, {
      groupCode: 'A-1',
    });

    await expect(validate(dto)).resolves.toEqual([
      expect.objectContaining({
        property: 'groupCode',
      }),
    ]);
  });
});
