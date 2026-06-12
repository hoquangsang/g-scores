'use client';

import { useSearchParams } from 'next/navigation';
import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { getCandidateScore, getErrorMessage, type CandidateScoreDetail } from '@/lib/api';

export function useScoreLookup() {
  const searchParams = useSearchParams();
  const initialRegistrationNumber = searchParams.get('registrationNumber') ?? '';
  const [registrationNumber, setRegistrationNumber] = useState(initialRegistrationNumber);
  const [candidate, setCandidate] = useState<CandidateScoreDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!initialRegistrationNumber) {
      return;
    }

    void lookupCandidate(initialRegistrationNumber);
  }, [initialRegistrationNumber]);

  async function lookupCandidate(value: string) {
    const normalizedRegistrationNumber = value.trim();
    if (!normalizedRegistrationNumber) {
      setError('Nhập số báo danh trước khi tra cứu.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getCandidateScore(normalizedRegistrationNumber);
      setCandidate(result);
    } catch (lookupError) {
      setCandidate(null);
      setError(getErrorMessage(lookupError));
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookupCandidate(registrationNumber || initialRegistrationNumber);
  }

  const scoreMap = useMemo(() => {
    return new Map(candidate?.scores.map((score) => [score.subjectCode, score]) ?? []);
  }, [candidate]);

  return {
    candidate,
    error,
    handleSubmit,
    initialRegistrationNumber,
    isLoading,
    registrationNumber,
    scoreMap,
    setRegistrationNumber,
  };
}
