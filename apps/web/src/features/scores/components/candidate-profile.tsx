import type { CandidateScoreDetail } from '@/lib/api';
import { formatExamTrack } from '@/lib/format';

export function CandidateProfile({ candidate }: { readonly candidate: CandidateScoreDetail }) {
  return (
    <article className="panel">
      <div className="candidate-profile">
        <span>Số báo danh</span>
        <strong>{candidate.registrationNumber}</strong>
        <dl>
          <div>
            <dt>Khối tự chọn</dt>
            <dd>{formatExamTrack(candidate.examTrack)}</dd>
          </div>
          <div>
            <dt>Ngoại ngữ</dt>
            <dd>{candidate.foreignLanguage?.code ?? 'Không có'}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
