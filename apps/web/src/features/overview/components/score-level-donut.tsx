import type { CSSProperties } from 'react';

import type { ScoreLevelReport } from '@/lib/api';
import { formatInteger, getScoreLevelLabel, getSubjectLabel } from '@/lib/format';

type DonutSegmentStyle = CSSProperties & {
  readonly '--fan-color': string;
};

type DonutSegment = {
  readonly color: string;
  readonly dash: number;
  readonly endRatio: number;
  readonly level: ScoreLevelReport['levels'][number];
  readonly offset: number;
  readonly ratio: number;
};

export function ScoreLevelDonut({ report }: { readonly report: ScoreLevelReport }) {
  const total = getScoreLevelTotal(report);
  const circumference = 2 * Math.PI * 74;
  const segmentGap = total > 0 ? 3.2 : 0;
  const segments = report.levels.reduce<DonutSegment[]>((items, level, index) => {
    const ratio = total > 0 ? level.count / total : 0;
    const previousRatio = items.at(-1)?.endRatio ?? 0;
    const rawDash = ratio * circumference;

    return [
      ...items,
      {
        color: `var(--fan-${index + 1})`,
        dash: Math.max(rawDash - segmentGap, 0),
        endRatio: previousRatio + ratio,
        level,
        offset: -previousRatio * circumference - segmentGap / 2,
        ratio,
      },
    ];
  }, []);

  return (
    <div className="fan-chart-wrap fan-chart-wrap--horizontal">
      <div className="fan-chart">
        <svg
          aria-label={`Tỷ trọng mức điểm ${getSubjectLabel(report.subject.code)}`}
          viewBox="0 0 220 220"
        >
          <circle className="fan-track" cx="110" cy="110" r="74" />
          <g transform="rotate(-90 110 110)">
            {segments.map((segment) => (
              <circle
                className="fan-segment"
                cx="110"
                cy="110"
                key={segment.level.code}
                r="74"
                style={
                  {
                    '--fan-color': segment.color,
                    strokeDasharray: `${segment.dash} ${circumference - segment.dash}`,
                    strokeDashoffset: segment.offset,
                  } as DonutSegmentStyle
                }
              >
                <title>
                  {getScoreLevelLabel(segment.level.code)}: {formatInteger(segment.level.count)} thí
                  sinh ({(segment.ratio * 100).toFixed(1)}%)
                </title>
              </circle>
            ))}
          </g>
        </svg>
        <span>{formatInteger(total)}</span>
      </div>
      <div className="fan-legend">
        {report.levels.map((level, index) => {
          const percentage = total > 0 ? (level.count / total) * 100 : 0;

          return (
            <div key={level.code}>
              <i style={{ background: `var(--fan-${index + 1})` }} />
              <span>{getScoreLevelLabel(level.code)}</span>
              <strong>{formatInteger(level.count)}</strong>
              <small>{percentage.toFixed(1)}%</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getScoreLevelTotal(report: ScoreLevelReport): number {
  return report.levels.reduce((sum, level) => sum + level.count, 0);
}
