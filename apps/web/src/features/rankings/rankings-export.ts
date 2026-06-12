import type { TopGroupReport } from '@/lib/api';
import { exportCsv } from '@/lib/export';
import { formatScore, formatSubjectScore, getSubjectLabel } from '@/lib/format';

export function exportRanking({
  groupCode,
  subjectCodes,
  topGroup,
}: {
  readonly groupCode: string;
  readonly subjectCodes: string[];
  readonly topGroup: TopGroupReport;
}) {
  exportCsv(
    `top-${groupCode.toLowerCase()}-ranking.csv`,
    ['Hạng', 'Số báo danh', ...subjectCodes.map(getSubjectLabel), 'Tổng điểm'],
    topGroup.items.map((candidate) => [
      candidate.rank,
      candidate.registrationNumber,
      ...subjectCodes.map((subjectCode) => formatSubjectScore(candidate, subjectCode)),
      formatScore(candidate.totalScore),
    ]),
  );
}
