import { Injectable } from '@nestjs/common';
import { CacheService, createCacheKey } from '@repo/cache';

import { CatalogsRepository } from './catalogs.repository';
import type { CatalogExamGroup, CatalogSubject } from './catalogs.types';

@Injectable()
export class CatalogsService {
  private readonly cacheService: CacheService;
  private readonly catalogsRepository: CatalogsRepository;

  constructor(catalogsRepository: CatalogsRepository, cacheService: CacheService) {
    this.catalogsRepository = catalogsRepository;
    this.cacheService = cacheService;
  }

  getSubjects(): Promise<CatalogSubject[]> {
    return this.cacheService.remember(createCacheKey('catalogs', 'subjects'), () =>
      this.catalogsRepository.findSubjects(),
    );
  }

  getExamGroups(): Promise<CatalogExamGroup[]> {
    return this.cacheService.remember(createCacheKey('catalogs', 'exam-groups'), () =>
      this.catalogsRepository.findExamGroups(),
    );
  }
}
