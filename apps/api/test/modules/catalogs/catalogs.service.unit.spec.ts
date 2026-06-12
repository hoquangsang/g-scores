import { describe, expect, it, jest } from '@jest/globals';
import { CacheService } from '@repo/cache';

import { CatalogsRepository } from '@/modules/catalogs/catalogs.repository';
import { CatalogsService } from '@/modules/catalogs/catalogs.service';

describe(CatalogsService.name, () => {
  it('returns subjects from repository', async () => {
    const findSubjects = jest.fn().mockResolvedValue([{ code: 'toan', name: 'Toán' }]);
    const service = new CatalogsService(
      createCatalogsRepositoryMock({
        findSubjects,
      }),
      createCacheServiceMock(),
    );

    await expect(service.getSubjects()).resolves.toEqual([{ code: 'toan', name: 'Toán' }]);
    expect(findSubjects).toHaveBeenCalledTimes(1);
  });

  it('returns exam groups from repository', async () => {
    const findExamGroups = jest.fn().mockResolvedValue([
      {
        code: 'A',
        name: 'Khối A',
        subjects: [],
      },
    ]);
    const service = new CatalogsService(
      createCatalogsRepositoryMock({
        findExamGroups,
      }),
      createCacheServiceMock(),
    );

    await expect(service.getExamGroups()).resolves.toEqual([
      {
        code: 'A',
        name: 'Khối A',
        subjects: [],
      },
    ]);
    expect(findExamGroups).toHaveBeenCalledTimes(1);
  });
});

function createCatalogsRepositoryMock(
  overrides: Partial<Record<keyof CatalogsRepository, jest.Mock>>,
): CatalogsRepository {
  return {
    findSubjects: jest.fn(),
    findExamGroups: jest.fn(),
    ...overrides,
  } as unknown as CatalogsRepository;
}

function createCacheServiceMock(): CacheService {
  return {
    remember: jest.fn(async (_key, factory: () => Promise<unknown>) => factory()),
  } as unknown as CacheService;
}
