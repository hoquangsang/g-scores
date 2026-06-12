'use client';

import { Alert } from '@/components/ui';

import { RankingHero } from './components/ranking-hero';
import { RankingTable } from './components/ranking-table';
import { TopRankCards } from './components/top-rank-cards';
import { useRanking } from './hooks/use-ranking';
import { exportRanking } from './rankings-export';

export function RankingsPage() {
  const {
    error,
    groupCode,
    isLoading,
    setGroupCode,
    subjectCodes,
    tableCandidates,
    topCandidates,
    topGroup,
  } = useRanking();

  return (
    <>
      {error ? <Alert>{error}</Alert> : null}

      <RankingHero groupCode={groupCode} onGroupChange={setGroupCode} />

      <TopRankCards
        groupCode={groupCode}
        isLoading={isLoading}
        subjectCodes={subjectCodes}
        topCandidates={topCandidates}
      />

      <RankingTable
        groupCode={groupCode}
        subjectCodes={subjectCodes}
        tableCandidates={tableCandidates}
        topGroup={topGroup}
        onExport={() => topGroup && exportRanking({ groupCode, subjectCodes, topGroup })}
      />
    </>
  );
}
