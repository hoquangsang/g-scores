import { Module } from '@nestjs/common';

import { CatalogsController } from './catalogs.controller';
import { CatalogsRepository } from './catalogs.repository';
import { CatalogsService } from './catalogs.service';

@Module({
  controllers: [CatalogsController],
  providers: [CatalogsRepository, CatalogsService],
})
export class CatalogsModule {}
