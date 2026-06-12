import type { ScoreDistribution } from '@/lib/api';
import { formatInteger, getSubjectLabel, getSubjectScoreStep } from '@/lib/format';

const preferredTickCount = 6;

export function ScoreDistributionBarChart({
  distribution,
}: {
  readonly distribution: ScoreDistribution;
}) {
  const minScore = 0;
  const maxScore = 10;
  const scoreStep = getSubjectScoreStep(distribution.subject.code);
  const scoreSlots = Array.from(
    { length: Math.round((maxScore - minScore) / scoreStep) + 1 },
    (_, index) => Number((minScore + index * scoreStep).toFixed(2)),
  );
  const countByScore = new Map(
    distribution.items.map((item) => [getScoreKey(item.score), item.count]),
  );
  const chartItems = scoreSlots.map((score) => ({
    count: countByScore.get(getScoreKey(score)) ?? 0,
    score,
  }));
  const maxCount = Math.max(...chartItems.map((item) => item.count), 1);
  const yScale = getNiceYAxis(maxCount);
  const width = 1120;
  const height = 520;
  const padding = { top: 46, right: 26, bottom: 72, left: 92 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const barGap = scoreStep === 0.2 ? 3 : 4;
  const barWidth = Math.max(plotWidth / Math.max(chartItems.length, 1) - barGap, 4);
  const xTicks = Array.from({ length: 11 }, (_, score) => ({
    value: score,
    x: padding.left + (score / maxScore) * plotWidth,
  }));
  const minorTicks = scoreSlots
    .filter((score) => !Number.isInteger(score))
    .map((score) => ({
      value: score,
      x: padding.left + ((score - minScore) / (maxScore - minScore)) * plotWidth,
    }));

  return (
    <div className="bar-chart-wrap">
      <svg
        aria-label={`Phân bổ điểm ${getSubjectLabel(distribution.subject.code)}`}
        className="distribution-bar-chart"
        viewBox={`0 0 ${width} ${height}`}
      >
        {yScale.ticks.map((value) => {
          const ratio = value / yScale.max;
          const y = padding.top + plotHeight - ratio * plotHeight;

          return (
            <g key={value}>
              <line
                className="chart-grid-line"
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
              />
              <text
                className="chart-axis-label chart-axis-label--large"
                x={padding.left - 14}
                y={y + 5}
                textAnchor="end"
              >
                {formatInteger(value)}
              </text>
            </g>
          );
        })}
        {xTicks.map((tick) => (
          <g key={tick.value}>
            <line
              className="chart-axis-tick"
              x1={tick.x}
              x2={tick.x}
              y1={padding.top + plotHeight}
              y2={padding.top + plotHeight + 9}
            />
            <text
              className="chart-axis-label chart-axis-label--large"
              x={tick.x}
              y={height - 24}
              textAnchor="middle"
            >
              {tick.value}
            </text>
          </g>
        ))}
        {minorTicks.map((tick) => (
          <line
            className="chart-axis-tick chart-axis-tick--minor"
            key={tick.value}
            x1={tick.x}
            x2={tick.x}
            y1={padding.top + plotHeight}
            y2={padding.top + plotHeight + 7}
          />
        ))}
        <text
          className="chart-axis-title chart-axis-title--vertical"
          textAnchor="middle"
          transform={`translate(26 ${padding.top + plotHeight / 2}) rotate(-90)`}
        >
          Số lượng thí sinh
        </text>
        <text
          className="chart-axis-title chart-axis-title--large"
          x={width - padding.right}
          y={height - 8}
          textAnchor="end"
        >
          Điểm
        </text>
        {chartItems.map((item, index) => {
          const x = padding.left + ((item.score - minScore) / (maxScore - minScore)) * plotWidth;
          const barHeight = (item.count / yScale.max) * plotHeight;
          const y = padding.top + plotHeight - barHeight;

          return (
            <g className={`bar-group bar-group--delay-${index % 12}`} key={item.score}>
              <rect
                className="chart-bar"
                height={barHeight}
                rx="2"
                width={barWidth}
                x={x - barWidth / 2}
                y={y}
              >
                <title>
                  {item.score.toFixed(2)} điểm: {formatInteger(item.count)} thí sinh
                </title>
              </rect>
              {item.count > 0 ? (
                <text
                  className="bar-value-label"
                  textAnchor="start"
                  transform={`translate(${x + 2} ${Math.max(y - 8, 12)}) rotate(-90)`}
                >
                  {formatInteger(item.count)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function getNiceYAxis(maxValue: number): { readonly max: number; readonly ticks: number[] } {
  const step = getNiceStep(maxValue / preferredTickCount);
  const max = Math.max(step, Math.ceil(maxValue / step) * step);
  const ticks: number[] = [];

  for (let value = 0; value <= max; value += step) {
    ticks.push(value);
  }

  return { max, ticks };
}

function getNiceStep(rawStep: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(rawStep, 1)));
  const normalized = rawStep / magnitude;

  if (normalized <= 1) {
    return magnitude;
  }

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function getScoreKey(score: number): string {
  return score.toFixed(2);
}
