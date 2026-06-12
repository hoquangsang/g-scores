import type { ScoreDistribution } from '@/lib/api';

export type PeakScoreMetric = {
  readonly count: number;
  readonly scores: number[];
};

export function getPeakScoreMetric(distribution: ScoreDistribution | null): PeakScoreMetric | null {
  if (!distribution || distribution.items.length === 0) {
    return null;
  }

  const maxCount = Math.max(...distribution.items.map((item) => item.count));
  const scores = distribution.items
    .filter((item) => item.count === maxCount)
    .map((item) => item.score)
    .sort((a, b) => a - b);

  return {
    count: maxCount,
    scores,
  };
}

export function getAverageScore(distribution: ScoreDistribution | null): number | null {
  if (!distribution || distribution.items.length === 0) {
    return null;
  }

  const totalCount = distribution.items.reduce((sum, item) => sum + item.count, 0);
  if (totalCount === 0) {
    return null;
  }

  const weightedTotal = distribution.items.reduce((sum, item) => sum + item.score * item.count, 0);

  return weightedTotal / totalCount;
}
