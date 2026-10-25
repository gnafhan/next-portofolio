/** Simple horizontal bar chart for MDX. Values are plain numbers; unit is appended. */
export function BarChart({
  items,
  unit = "",
  max,
}: {
  items: { label: string; value: number; highlight?: boolean }[];
  unit?: string;
  max?: number;
}) {
  const top = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2.5">
      {items.map((i) => (
        <div key={i.label} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto] items-center gap-3 text-[0.88rem]">
          <span className="truncate text-ink-2">{i.label}</span>
          <span className="h-3 rounded-sm bg-surface-2">
            <span
              className={`block h-full rounded-sm ${i.highlight ? "bg-accent" : "bg-line-strong"}`}
              style={{ width: `${Math.max(2, (i.value / top) * 100)}%` }}
            />
          </span>
          <span className="text-[0.85rem] tabular-nums text-ink">
            {i.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
