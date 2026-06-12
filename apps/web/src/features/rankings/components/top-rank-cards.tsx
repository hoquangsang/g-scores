import { Medal, User } from 'lucide-react';

import { CardSkeleton, EmptyState } from '@/components/ui';
import type { TopGroupReport } from '@/lib/api';
import { examGroupLabels, formatScore, formatSubjectScore, getSubjectLabel } from '@/lib/format';

export function TopRankCards({
  groupCode,
  isLoading,
  subjectCodes,
  topCandidates,
}: {
  readonly groupCode: string;
  readonly isLoading: boolean;
  readonly subjectCodes: string[];
  readonly topCandidates: TopGroupReport['items'];
}) {
  return (
    <section className="ranking-grid" aria-label={`Top 3 thí sinh ${examGroupLabels[groupCode]}`}>
      {isLoading ? (
        <CardSkeleton count={3} />
      ) : topCandidates.length > 0 ? (
        topCandidates.map((candidate) => (
          <article
            className={`rank-card rank-card--rank-${candidate.rank} ${candidate.rank === 1 ? 'rank-card--first' : ''}`}
            key={candidate.registrationNumber}
          >
            <span className="rank-badge">{candidate.rank}</span>
            <div className="rank-icon">
              {candidate.rank === 1 ? <Medal size={30} /> : <User size={28} />}
            </div>
            <strong className="rank-number">{candidate.registrationNumber}</strong>
            <span className="rank-score">{formatScore(candidate.totalScore)}</span>
            <div className="rank-subjects">
              {subjectCodes.map((subjectCode) => (
                <div key={subjectCode}>
                  <span>{getSubjectLabel(subjectCode)}</span>
                  <strong>{formatSubjectScore(candidate, subjectCode)}</strong>
                </div>
              ))}
            </div>
          </article>
        ))
      ) : (
        <EmptyState title="Chưa có bảng xếp hạng" description="Hãy import dữ liệu và thử lại." />
      )}
    </section>
  );
}
