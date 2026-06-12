'use client';

import { Alert, CardSkeleton, EmptyState } from '@/components/ui';
import { getSubjectLabel } from '@/lib/format';

import { OverviewHero } from './components/overview-hero';
import { OverviewStats } from './components/overview-stats';
import { ScoreDistributionBarChart } from './components/score-distribution-bar-chart';
import { ScoreLevelDonut } from './components/score-level-donut';
import { useOverviewData } from './hooks/use-overview-data';

export function OverviewPage() {
  const {
    distribution,
    error,
    isDistributionLoading,
    isSummaryLoading,
    selectedReport,
    selectedSubject,
    setSelectedSubject,
    subjectOptions,
    summary,
  } = useOverviewData();

  return (
    <>
      {error ? <Alert>{error}</Alert> : null}

      <OverviewHero
        selectedSubject={selectedSubject}
        subjectOptions={subjectOptions}
        onSubjectChange={setSelectedSubject}
      />

      <OverviewStats
        distribution={distribution}
        summary={summary}
        isLoading={isSummaryLoading || isDistributionLoading}
      />

      <section className="panel report-chart-panel report-chart-panel--full">
        <div className="panel-header panel-header--inline">
          <div>
            <h2>Phân bổ điểm</h2>
            <p>
              {getSubjectLabel(selectedSubject)} · Trục Y là số thí sinh, trục X là điểm thực tế.
            </p>
          </div>
        </div>
        {isDistributionLoading ? (
          <div className="chart-skeleton chart-skeleton--large" />
        ) : distribution && distribution.items.length > 0 ? (
          <ScoreDistributionBarChart distribution={distribution} />
        ) : (
          <EmptyState title="Chưa có dữ liệu" description="Không tải được phân bổ điểm môn này." />
        )}
      </section>

      <section className="panel score-level-panel score-level-panel--dashboard">
        <div className="panel-header panel-header--inline">
          <div>
            <h2>Tỷ trọng mức điểm</h2>
            <p>{getSubjectLabel(selectedSubject)}</p>
          </div>
        </div>
        {selectedReport ? (
          <ScoreLevelDonut report={selectedReport} />
        ) : (
          <CardSkeleton count={4} compact />
        )}
      </section>
    </>
  );
}
