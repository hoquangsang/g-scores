import { describe, expect, it } from '@jest/globals';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { TopGroupQueryDto } from '@/modules/reports/dto/top-group.query.dto';

describe(TopGroupQueryDto.name, () => {
  it('defaults limit to 10', () => {
    const dto = plainToInstance(TopGroupQueryDto, {});

    expect(dto.limit).toBe(10);
  });

  it('accepts transformed integer limit', async () => {
    const dto = plainToInstance(TopGroupQueryDto, {
      limit: '25',
    });

    expect(dto.limit).toBe(25);
    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects out-of-range limits', async () => {
    const dto = plainToInstance(TopGroupQueryDto, {
      limit: '101',
    });

    await expect(validate(dto)).resolves.toEqual([
      expect.objectContaining({
        property: 'limit',
      }),
    ]);
  });
});
