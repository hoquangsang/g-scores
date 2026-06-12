import type { CandidateScore } from '@/lib/api';
import { formatScore, getSubjectLabel } from '@/lib/format';

export function ScoreGroupCard({
  groupLabel,
  scores,
}: {
  readonly groupLabel: string;
  readonly scores: Array<CandidateScore | string>;
}) {
  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <h2>{groupLabel}</h2>
          <p>Điểm thiếu nghĩa là thí sinh không có dữ liệu môn đó.</p>
        </div>
      </div>
      <div className="score-list score-list--stacked">
        {scores.map((score) => {
          if (typeof score === 'string') {
            return (
              <div className="score-row" key={score}>
                <span>{getSubjectLabel(score)}</span>
                <strong>-</strong>
              </div>
            );
          }

          return (
            <div className="score-row" key={score.subjectCode}>
              <span>{getSubjectLabel(score.subjectCode)}</span>
              <strong>{formatScore(score.score)}</strong>
            </div>
          );
        })}
      </div>
    </article>
  );
}
