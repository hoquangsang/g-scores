'use client';

import { Suspense } from 'react';

import { Alert, CardSkeleton, EmptyState } from '@/components/ui';
import { scoreGroups } from '@/lib/format';

import { CandidateProfile } from './components/candidate-profile';
import { ScoreGroupCard } from './components/score-group-card';
import { ScoreLookupForm } from './components/score-lookup-form';
import { useScoreLookup } from './hooks/use-score-lookup';

export function ScoresPage() {
  return (
    <Suspense fallback={<ScoresFallback />}>
      <ScoresContent />
    </Suspense>
  );
}

function ScoresContent() {
  const {
    candidate,
    error,
    handleSubmit,
    initialRegistrationNumber,
    isLoading,
    registrationNumber,
    scoreMap,
    setRegistrationNumber,
  } = useScoreLookup();

  return (
    <>
      {error ? <Alert>{error}</Alert> : null}

      <section className="page-hero page-hero--compact">
        <span className="live-pill">Tra cứu điểm</span>
        <h1>Kiểm tra điểm theo số báo danh</h1>
        <p>Hiển thị điểm theo từng môn, từng tổ hợp và ngoại ngữ của thí sinh.</p>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Nhập số báo danh</h2>
            <p>Thanh tìm kiếm nhanh phía trên cũng dẫn về trang này.</p>
          </div>
        </div>

        <ScoreLookupForm
          fallbackRegistrationNumber={initialRegistrationNumber}
          isLoading={isLoading}
          registrationNumber={registrationNumber}
          onRegistrationNumberChange={setRegistrationNumber}
          onSubmit={handleSubmit}
        />
      </section>

      {candidate ? (
        <section className="score-detail-grid">
          <CandidateProfile candidate={candidate} />
          {scoreGroups.map((group) => (
            <ScoreGroupCard
              groupLabel={group.label}
              key={group.label}
              scores={group.subjects.map((subjectCode) => scoreMap.get(subjectCode) ?? subjectCode)}
            />
          ))}
        </section>
      ) : (
        <section className="panel">
          <EmptyState
            title="Chưa có kết quả"
            description="Nhập số báo danh hoặc dùng thanh tra cứu nhanh để xem điểm."
          />
        </section>
      )}
    </>
  );
}

function ScoresFallback() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <span className="live-pill">Tra cứu điểm</span>
        <h1>Kiểm tra điểm theo số báo danh</h1>
        <p>Đang chuẩn bị trang tra cứu.</p>
      </section>
      <section className="panel">
        <CardSkeleton count={3} compact />
      </section>
    </>
  );
}
