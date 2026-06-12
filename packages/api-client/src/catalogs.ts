import type { ApiClient } from './client';
import { unwrapData } from './response';
import type { ExamGroup, Subject } from './types';

export function getSubjects(client: ApiClient): Promise<Subject[]> {
  return unwrapData(client.GET('/api/v1/catalogs/subjects'), 'Failed to load subjects');
}

export function getExamGroups(client: ApiClient): Promise<ExamGroup[]> {
  return unwrapData(client.GET('/api/v1/catalogs/exam-groups'), 'Failed to load exam groups');
}
