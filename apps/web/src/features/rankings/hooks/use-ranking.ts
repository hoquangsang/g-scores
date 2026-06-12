'use client';

import { useEffect, useMemo, useState } from 'react';

import { getErrorMessage, getTopGroupReport, type TopGroupReport } from '@/lib/api';
import { examGroupSubjectCodes } from '@/lib/format';

export function useRanking() {
  const [groupCode, setGroupCode] = useState('A');
  const [topGroup, setTopGroup] = useState<TopGroupReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadRanking() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getTopGroupReport(groupCode, 10);
        if (isActive) {
          setTopGroup(result);
        }
      } catch (loadError) {
        if (isActive) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadRanking();

    return () => {
      isActive = false;
    };
  }, [groupCode]);

  const subjectCodes = useMemo(() => {
    const apiSubjects = topGroup?.group.subjects.map((subject) => subject.code) ?? [];
    return apiSubjects.length > 0 ? apiSubjects : (examGroupSubjectCodes[groupCode] ?? []);
  }, [groupCode, topGroup]);

  return {
    error,
    groupCode,
    isLoading,
    setGroupCode,
    subjectCodes,
    tableCandidates: topGroup?.items.slice(3, 10) ?? [],
    topCandidates: topGroup?.items.slice(0, 3) ?? [],
    topGroup,
  };
}
