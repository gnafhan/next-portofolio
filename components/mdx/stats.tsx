export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="not-prose my-7 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
      {items.map((s) => (
        <div key={s.label} className="glass rounded-[20px] px-4 py-3.5">
          <div className="text-[1.5rem] font-semibold tracking-tight">{s.value}</div>
          <div className="mt-0.5 text-[0.85rem] text-ink-3">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
