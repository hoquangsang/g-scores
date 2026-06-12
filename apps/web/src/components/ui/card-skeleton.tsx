export function CardSkeleton({
  count,
  compact = false,
}: {
  readonly count: number;
  readonly compact?: boolean;
}) {
  return Array.from({ length: count }, (_, index) => (
    <div className={compact ? 'skeleton skeleton--compact' : 'skeleton'} key={index} />
  ));
}
