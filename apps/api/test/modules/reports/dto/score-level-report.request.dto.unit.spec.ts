import { describe, expect, it } from '@jest/globals';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ScoreLevelReportRequestDto } from '@/modules/reports/dto/score-level-report.request.dto';

describe(ScoreLevelReportRequestDto.name, () => {
  it('accepts lower-case subject codes', async () => {
    const dto = plainToInstance(ScoreLevelReportRequestDto, {
      subjectCode: 'ngoai_ngu',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects upper-case or unsafe subject codes', async () => {
    const dto = plainToInstance(ScoreLevelReportRequestDto, {
      subjectCode: 'TOAN',
    });

    await expect(validate(dto)).resolves.toEqual([
      expect.objectContaining({
        property: 'subjectCode',
      }),
    ]);
  });
});
