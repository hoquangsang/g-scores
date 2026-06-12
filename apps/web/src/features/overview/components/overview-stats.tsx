import { BookOpen, Sigma, TrendingUp, Users } from 'lucide-react';

import { StatCard } from '@/components/ui';
import type { ReportSummary, ScoreDistribution } from '@/lib/api';
import { formatInteger, formatScore } from '@/lib/format';

import { getAverageScore, getPeakScoreMetric } from '../overview-metrics';

export function OverviewStats({
  summary,
  distribution,
  isLoading,
}: {
  readonly summary: ReportSummary | null;
  readonly distribution: ScoreDistribution | null;
  readonly isLoading: boolean;
}) {
  const peakScore = getPeakScoreMetric(distribution);
  const averageScore = getAverageScore(distribution);
  const peakScoreTitle = peakScore
    ? `Cùng mức cao nhất: ${peakScore.scores.map(formatScore).join(', ')}`
    : undefined;
  const peakScoreSubtext = peakScore
    ? `${formatInteger(peakScore.count)} thí sinh${
        peakScore.scores.length > 1 ? ` · +${peakScore.scores.length - 1} điểm khác` : ''
      }`
    : '...';

  return (
    <div className="stat-grid stat-grid--overview" aria-label="Tổng quan dữ liệu">
      <StatCard
        icon={BookOpen}
        label="Tổng môn thi"
        tone="blue"
        value={isLoading ? '...' : formatInteger(summary?.subjectCount ?? 0)}
      />
      <StatCard
        icon={Users}
        label="Tổng thí sinh"
        tone="orange"
        value={isLoading ? '...' : formatInteger(summary?.candidateCount ?? 0)}
      />
      <StatCard
        icon={TrendingUp}
        label="Điểm nhiều nhất"
        subtext={peakScoreSubtext}
        title={peakScoreTitle}
        tone="green"
        value={peakScore ? formatScore(peakScore.scores[0] ?? 0) : '...'}
      />
      <StatCard
        icon={Sigma}
        label="Điểm trung bình"
        subtext="Theo môn đang chọn"
        tone="purple"
        value={averageScore === null ? '...' : formatScore(averageScore)}
      />
    </div>
  );
}
