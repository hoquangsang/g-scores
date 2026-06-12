import { describe, expect, it, jest } from '@jest/globals';

import { CatalogsController } from '@/modules/catalogs/catalogs.controller';
import { CatalogsService } from '@/modules/catalogs/catalogs.service';

describe(CatalogsController.name, () => {
  it('wraps subject catalog response', async () => {
    const controller = new CatalogsController(
      createCatalogsServiceMock({
        getSubjects: jest.fn().mockResolvedValue([{ code: 'toan', name: 'Toán' }]),
      }),
    );

    const response = await controller.getSubjects();

    expect(response).toMatchObject({
      success: true,
      data: [{ code: 'toan', name: 'Toán' }],
    });
  });

  it('wraps exam group catalog response', async () => {
    const controller = new CatalogsController(
      createCatalogsServiceMock({
        getExamGroups: jest.fn().mockResolvedValue([{ code: 'A', name: 'Khối A', subjects: [] }]),
      }),
    );

    const response = await controller.getExamGroups();

    expect(response).toMatchObject({
      success: true,
      data: [{ code: 'A', name: 'Khối A', subjects: [] }],
    });
  });
});

function createCatalogsServiceMock(
  overrides: Partial<Record<keyof CatalogsService, jest.Mock>>,
): CatalogsService {
  return {
    getSubjects: jest.fn(),
    getExamGroups: jest.fn(),
    ...overrides,
  } as unknown as CatalogsService;
}
