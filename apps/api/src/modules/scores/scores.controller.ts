import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiSuccessResponseDto } from '@/common/decorators';
import { SuccessResponse } from '@/common/responses';

import { CandidateScoreResponseDto } from './dto/candidate-score.response.dto';
import { LookupScoreRequestDto } from './dto/lookup-score.request.dto';
import { ScoresService } from './scores.service';

@ApiTags('Scores')
@Controller({
  path: 'scores',
  version: '1',
})
export class ScoresController {
  private readonly scoresService: ScoresService;

  constructor(scoresService: ScoresService) {
    this.scoresService = scoresService;
  }

  @Get(':registrationNumber')
  @ApiParam({ name: 'registrationNumber', example: '01000001' })
  @ApiSuccessResponseDto(CandidateScoreResponseDto, {
    description: 'Candidate score detail',
  })
  async getCandidateScore(
    @Param() params: LookupScoreRequestDto,
  ): Promise<SuccessResponse<CandidateScoreResponseDto>> {
    const candidateScore = await this.scoresService.getCandidateScoreDetail(
      params.registrationNumber,
    );

    return SuccessResponse.of({ data: candidateScore });
  }
}
