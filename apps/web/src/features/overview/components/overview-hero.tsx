import { ChevronDown } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

import { getSubjectLabel } from '@/lib/format';

export function OverviewHero({
  selectedSubject,
  subjectOptions,
  onSubjectChange,
}: {
  readonly selectedSubject: string;
  readonly subjectOptions: string[];
  readonly onSubjectChange: Dispatch<SetStateAction<string>>;
}) {
  return (
    <section className="page-hero page-hero--with-control">
      <div>
        <span className="live-pill">Tổng quan</span>
        <h1>Phân tích điểm thi THPT Quốc Gia 2024</h1>
        <p>
          Theo dõi phổ điểm từng môn, tỷ trọng 4 mức điểm và dữ liệu tổng quan từ cơ sở dữ liệu.
        </p>
      </div>
      <label className="select-field">
        <span>Môn báo cáo</span>
        <select value={selectedSubject} onChange={(event) => onSubjectChange(event.target.value)}>
          {subjectOptions.map((subjectCode) => (
            <option key={subjectCode} value={subjectCode}>
              {getSubjectLabel(subjectCode)}
            </option>
          ))}
        </select>
        <ChevronDown size={18} aria-hidden="true" />
      </label>
    </section>
  );
}
