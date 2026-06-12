import { describe, expect, it } from 'vitest';

import {
  examGroupSubjectCodes,
  formatInteger,
  formatScore,
  formatSubjectScore,
  getSubjectLabel,
} from '../../src/lib/format';
import type { TopGroupReport } from '../../src/lib/api';

describe('format helpers', () => {
  it('formats scores and integers for dashboard display', () => {
    expect(formatScore(8.4)).toBe('8.40');
    expect(formatInteger(1234567)).toBe('1.234.567');
  });

  it('returns Vietnamese labels for known subjects', () => {
    expect(getSubjectLabel('toan')).toBe('Toán');
    expect(getSubjectLabel('unknown_subject')).toBe('unknown_subject');
  });

  it('formats subject scores from top group candidates', () => {
    const candidate: TopGroupReport['items'][number] = {
      rank: 1,
      registrationNumber: '01000001',
      examTrack: 'NATURAL',
      totalScore: 28.4,
      scores: [
        { subjectCode: 'toan', subjectName: 'Toán', score: 9.4 },
        { subjectCode: 'vat_li', subjectName: 'Vật lí', score: 9.5 },
      ],
    };

    expect(formatSubjectScore(candidate, 'toan')).toBe('9.40');
    expect(formatSubjectScore(candidate, 'hoa_hoc')).toBe('-');
    expect(examGroupSubjectCodes.A).toEqual(['toan', 'vat_li', 'hoa_hoc']);
  });
});
