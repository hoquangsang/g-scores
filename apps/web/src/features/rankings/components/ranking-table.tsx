import { Download } from 'lucide-react';

import type { TopGroupReport } from '@/lib/api';
import { examGroupLabels, formatScore, formatSubjectScore, getSubjectLabel } from '@/lib/format';

export function RankingTable({
  groupCode,
  subjectCodes,
  tableCandidates,
  topGroup,
  onExport,
}: {
  readonly groupCode: string;
  readonly subjectCodes: string[];
  readonly tableCandidates: TopGroupReport['items'];
  readonly topGroup: TopGroupReport | null;
  readonly onExport: () => void;
}) {
  return (
    <section className="panel panel--table">
      <div className="panel-header panel-header--inline">
        <div>
          <h2>Danh sách thí sinh Top 4 - 10</h2>
          <p>{examGroupLabels[groupCode]}</p>
        </div>
        <button className="secondary-button" type="button" onClick={onExport} disabled={!topGroup}>
          <Download size={17} aria-hidden="true" />
          Xuất dữ liệu
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Số báo danh</th>
              {subjectCodes.map((subjectCode) => (
                <th key={subjectCode}>{getSubjectLabel(subjectCode)}</th>
              ))}
              <th>Tổng điểm</th>
            </tr>
          </thead>
          <tbody>
            {tableCandidates.length > 0 ? (
              tableCandidates.map((candidate) => (
                <tr key={candidate.registrationNumber}>
                  <td>{candidate.rank}</td>
                  <td>
                    <strong>{candidate.registrationNumber}</strong>
                  </td>
                  {subjectCodes.map((subjectCode) => (
                    <td key={subjectCode}>{formatSubjectScore(candidate, subjectCode)}</td>
                  ))}
                  <td>
                    <strong>{formatScore(candidate.totalScore)}</strong>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={subjectCodes.length + 3}>Chưa có dữ liệu xếp hạng.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
