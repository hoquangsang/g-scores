import { ChevronDown } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

import { examGroupCodes, examGroupLabels } from '@/lib/format';

export function RankingHero({
  groupCode,
  onGroupChange,
}: {
  readonly groupCode: string;
  readonly onGroupChange: Dispatch<SetStateAction<string>>;
}) {
  return (
    <section className="page-hero page-hero--with-control">
      <div>
        <span className="live-pill">Cập nhật trực tiếp</span>
        <h1>Bảng xếp hạng Top 10</h1>
        <p>Kỳ thi THPT Quốc Gia 2024.</p>
      </div>
      <label className="select-field">
        <span>Chọn khối</span>
        <select value={groupCode} onChange={(event) => onGroupChange(event.target.value)}>
          {examGroupCodes.map((code) => (
            <option key={code} value={code}>
              {examGroupLabels[code]}
            </option>
          ))}
        </select>
        <ChevronDown size={18} aria-hidden="true" />
      </label>
    </section>
  );
}
