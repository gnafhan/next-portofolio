type Kind = "auto" | "human" | "check";
export type FlowItem = { section?: string; label: string; note?: string; kind?: Kind };

function Marker({ kind = "check" }: { kind?: Kind }) {
  if (kind === "human") {
    return <span className="block size-[11px] rotate-45 bg-[var(--human)]" aria-label="a person decides" />;
  }
  return (
    <span
      className={`flex size-[15px] items-center justify-center rounded-full border bg-[var(--surface-solid)] ${
        kind === "auto" ? "border-[var(--ok)] text-[var(--ok)]" : "border-line-strong text-ink-3"
      }`}
      aria-label={kind === "auto" ? "automated" : "step"}
    >
      {kind === "auto" ? (
        <svg viewBox="0 0 10 10" className="size-[8px]" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 5.2 4.2 7.3 8 2.8" />
        </svg>
      ) : (
        <span className="size-[5px] rounded-full bg-current" />
      )}
    </span>
  );
}

/** Vertical step diagram: sections, steps, notes. kind = auto | human | check. */
export function Flow({ items, legend = true, compact = false }: { items: FlowItem[]; legend?: boolean; compact?: boolean }) {
  const kinds = new Set(items.map((i) => i.kind ?? "check"));
  return (
    <div className={`not-prose ${compact ? "" : "min-w-[320px]"}`}>
      <ol className="relative">
        <span className="absolute bottom-3 left-[7px] top-3 w-px bg-line-strong" aria-hidden />
        {items.map((item, i) => (
          <li key={i} className="relative">
            {item.section && (
              <div className="label mb-1 ml-8 mt-4 first:mt-0 !text-[0.66rem]">{item.section}</div>
            )}
            <div className={`grid grid-cols-[16px_minmax(0,1fr)] gap-x-4 py-1.5 ${compact ? "" : "sm:grid-cols-[16px_minmax(0,0.9fr)_minmax(0,1.3fr)]"}`}>
              <span className="relative z-10 flex h-6 items-center justify-center">
                <Marker kind={item.kind} />
              </span>
              <span className="text-[0.95rem] font-medium leading-6">{item.label}</span>
              {item.note && (
                <span className={`col-start-2 text-[0.88rem] leading-6 text-ink-2 ${compact ? "" : "sm:col-start-3"}`}>{item.note}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
      {legend && (kinds.has("auto") || kinds.has("human")) && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-3 text-[0.8rem] text-ink-3">
          {kinds.has("auto") && (
            <span className="flex items-center gap-2"><Marker kind="auto" /> automated</span>
          )}
          {kinds.has("human") && (
            <span className="flex items-center gap-2"><Marker kind="human" /> a person decides</span>
          )}
        </div>
      )}
    </div>
  );
}
