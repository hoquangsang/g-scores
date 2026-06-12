import type { LucideIcon } from 'lucide-react';

export function StatCard({
  icon: Icon,
  label,
  subtext,
  title,
  value,
  tone,
}: {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly subtext?: string;
  readonly title?: string;
  readonly value: string;
  readonly tone: string;
}) {
  return (
    <article className={`stat-card stat-card--${tone}`} title={title}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {subtext ? <small>{subtext}</small> : null}
      </div>
      <i>
        <Icon size={22} aria-hidden="true" />
      </i>
    </article>
  );
}
