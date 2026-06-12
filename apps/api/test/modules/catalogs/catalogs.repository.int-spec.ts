import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { CatalogsRepository } from '@/modules/catalogs/catalogs.repository';

import { createTestDatabaseClient } from '../../helpers/database';
import type { DatabaseService } from '@/database';
import type { DatabaseClient } from '@repo/database';

describe(CatalogsRepository.name, () => {
  let db: DatabaseClient;
  let repository: CatalogsRepository;

  beforeAll(() => {
    db = createTestDatabaseClient();
    repository = new CatalogsRepository({ client: db } as DatabaseService);
  });

  afterAll(async () => {
    await db?.$disconnect();
  });

  it('returns subjects in application order', async () => {
    const subjects = await repository.findSubjects();

    expect(subjects.map((subject) => subject.code)).toEqual([
      'toan',
      'ngu_van',
      'ngoai_ngu',
      'vat_li',
      'hoa_hoc',
      'sinh_hoc',
      'lich_su',
      'dia_li',
      'gdcd',
    ]);
  });

  it('returns exam groups with subjects in group order', async () => {
    const groups = await repository.findExamGroups();
    const groupA = groups.find((group) => group.code === 'A');
    const groupA1 = groups.find((group) => group.code === 'A1');

    expect(groupA?.subjects.map((subject) => subject.code)).toEqual(['toan', 'vat_li', 'hoa_hoc']);
    expect(groupA1?.subjects.map((subject) => subject.code)).toEqual([
      'toan',
      'vat_li',
      'ngoai_ngu',
    ]);
  });
});
