import type { ExamTrack } from '@repo/database';

export type CandidateForeignLanguage = {
  readonly code: string;
  readonly name: string | null;
};

export type CandidateSubjectScore = {
  readonly subjectCode: string;
  readonly subjectName: string;
  readonly score: number;
};

export type CandidateScoreDetail = {
  readonly registrationNumber: string;
  readonly examTrack: ExamTrack;
  readonly foreignLanguage: CandidateForeignLanguage | null;
  readonly scores: CandidateSubjectScore[];
};
