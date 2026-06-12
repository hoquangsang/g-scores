import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiSuccessResponseDto } from '@/common/decorators';
import { SuccessResponse } from '@/common/responses';

import { CatalogsService } from './catalogs.service';
import { ExamGroupResponseDto } from './dto/exam-group.response.dto';
import { SubjectResponseDto } from './dto/subject.response.dto';

@ApiTags('Catalogs')
@Controller({
  path: 'catalogs',
  version: '1',
})
export class CatalogsController {
  private readonly catalogsService: CatalogsService;

  constructor(catalogsService: CatalogsService) {
    this.catalogsService = catalogsService;
  }

  @Get('subjects')
  @ApiSuccessResponseDto(SubjectResponseDto, {
    description: 'List score subjects',
    isArray: true,
  })
  async getSubjects(): Promise<SuccessResponse<SubjectResponseDto[]>> {
    const subjects = await this.catalogsService.getSubjects();
    return SuccessResponse.of({ data: subjects });
  }

  @Get('exam-groups')
  @ApiSuccessResponseDto(ExamGroupResponseDto, {
    description: 'List exam groups',
    isArray: true,
  })
  async getExamGroups(): Promise<SuccessResponse<ExamGroupResponseDto[]>> {
    const examGroups = await this.catalogsService.getExamGroups();
    return SuccessResponse.of({ data: examGroups });
  }
}
