import { ApiProperty } from '@nestjs/swagger';
import { ExamTrack } from '@repo/database';

export class CandidateForeignLanguageResponseDto {
  @ApiProperty({ example: 'N1' })
  readonly code!: string;

  @ApiProperty({ type: String, example: 'English', nullable: true })
  readonly name!: string | null;
}

export class CandidateSubjectScoreResponseDto {
  @ApiProperty({ example: 'toan' })
  readonly subjectCode!: string;

  @ApiProperty({ example: 'Mathematics' })
  readonly subjectName!: string;

  @ApiProperty({ example: 8.4 })
  readonly score!: number;
}

export class CandidateScoreResponseDto {
  @ApiProperty({ example: '01000001' })
  readonly registrationNumber!: string;

  @ApiProperty({ enum: ExamTrack, example: ExamTrack.NATURAL })
  readonly examTrack!: ExamTrack;

  @ApiProperty({ type: CandidateForeignLanguageResponseDto, nullable: true })
  readonly foreignLanguage!: CandidateForeignLanguageResponseDto | null;

  @ApiProperty({ type: [CandidateSubjectScoreResponseDto] })
  readonly scores!: CandidateSubjectScoreResponseDto[];
}
