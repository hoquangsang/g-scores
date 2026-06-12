import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database';
import { getExamGroupSubjectOrderIndex, getSubjectOrderIndex } from './catalog.constants';
import type { CatalogExamGroup, CatalogSubject } from './catalogs.types';

@Injectable()
export class CatalogsRepository {
  private readonly database: DatabaseService;

  constructor(database: DatabaseService) {
    this.database = database;
  }

  async findSubjects(): Promise<CatalogSubject[]> {
    const subjects = await this.database.client.subject.findMany({
      select: {
        code: true,
        name: true,
      },
    });

    return subjects.toSorted(
      (left, right) =>
        getSubjectOrderIndex(left.code) - getSubjectOrderIndex(right.code) ||
        left.code.localeCompare(right.code),
    );
  }

  async findExamGroups(): Promise<CatalogExamGroup[]> {
    const examGroups = await this.database.client.examGroup.findMany({
      select: {
        code: true,
        name: true,
        subjects: {
          select: {
            subject: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        code: 'asc',
      },
    });

    return examGroups.map((examGroup) => {
      const subjects = examGroup.subjects
        .map(({ subject }) => subject)
        .toSorted(
          (left, right) =>
            getExamGroupSubjectOrderIndex(examGroup.code, left.code) -
              getExamGroupSubjectOrderIndex(examGroup.code, right.code) ||
            left.code.localeCompare(right.code),
        );

      return {
        code: examGroup.code,
        name: examGroup.name,
        subjects,
      };
    });
  }
}
