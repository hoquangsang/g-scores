'use client';

import { useEffect, useState } from 'react';

import {
  getErrorMessage,
  getReportSummary,
  getScoreDistribution,
  getScoreLevelReports,
  type ReportSummary,
  type ScoreDistribution,
  type ScoreLevelReports,
} from '@/lib/api';
import { defaultSubjects } from '@/lib/format';

const defaultSubjectCode = 'toan';

export function useOverviewData() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [scoreLevels, setScoreLevels] = useState<ScoreLevelReports | null>(null);
  const [distribution, setDistribution] = useState<ScoreDistribution | null>(null);
  const [selectedSubject, setSelectedSubject] = useState(defaultSubjectCode);
  const [error, setError] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isDistributionLoading, setIsDistributionLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadOverview() {
      setIsSummaryLoading(true);
      setError(null);

      try {
        const [nextSummary, nextScoreLevels] = await Promise.all([
          getReportSummary(),
          getScoreLevelReports(),
        ]);

        if (isActive) {
          setSummary(nextSummary);
          setScoreLevels(nextScoreLevels);
        }
      } catch (loadError) {
        if (isActive) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (isActive) {
          setIsSummaryLoading(false);
        }
      }
    }

    void loadOverview();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadDistribution() {
      setIsDistributionLoading(true);
      setError(null);

      try {
        const nextDistribution = await getScoreDistribution(selectedSubject);

        if (isActive) {
          setDistribution(nextDistribution);
        }
      } catch (loadError) {
        if (isActive) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (isActive) {
          setIsDistributionLoading(false);
        }
      }
    }

    void loadDistribution();

    return () => {
      isActive = false;
    };
  }, [selectedSubject]);

  const subjectOptions =
    scoreLevels?.reports.map((report) => report.subject.code) ?? defaultSubjects;
  const selectedReport =
    scoreLevels?.reports.find((report) => report.subject.code === selectedSubject) ?? null;

  return {
    distribution,
    error,
    isDistributionLoading,
    isSummaryLoading,
    scoreLevels,
    selectedReport,
    selectedSubject,
    setSelectedSubject,
    subjectOptions,
    summary,
  };
}
