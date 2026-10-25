import { ArrowRight, Check, MapPin, MessageCircle, Pencil, ScanLine } from "lucide-react";

/** Small "show, don't tell" scene for each case study card. */
export function WorkThumb({ slug }: { slug: string }) {
  const Scene = SCENES[slug] ?? Generic;
  return (
    <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl text-[0.72rem]">
      <Scene />
    </div>
  );
}

const SCENES: Record<string, () => React.ReactNode> = {
  catataja: () => (
    <div className="flex w-full items-center justify-center gap-2 px-3">
      <div className="lg-accent rounded-2xl rounded-br-md px-3 py-2">coffee 25k</div>
      <ArrowRight size={14} className="shrink-0 text-ink-3" aria-hidden />
      <div className="lg-sm w-[52%] rounded-xl px-3 py-2">
        <div className="text-ink-3">Ledger</div>
        <div className="mt-1 flex items-center justify-between font-medium">
          <span>Coffee</span>
          <span>Rp 25.000</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-ink-3">
          <span>Food</span>
          <span>Rp 40.000</span>
        </div>
      </div>
    </div>
  ),
  "inbox-assistant": () => (
    <div className="flex w-full items-center justify-center gap-2 px-3">
      <div className="flex flex-col gap-1.5">
        {["can you fix…", "please upload…", "quick review?"].map((t) => (
          <div key={t} className="lg-sm flex items-center gap-1 rounded-lg px-2 py-1 text-ink-2">
            <MessageCircle size={11} aria-hidden /> {t}
          </div>
        ))}
      </div>
      <ArrowRight size={14} className="shrink-0 text-ink-3" aria-hidden />
      <div className="lg-sm w-[44%] rounded-xl px-2.5 py-2">
        <div className="mb-1 font-medium">One board</div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="mt-1 flex items-center gap-1.5">
            <span className="lg-ok flex size-3.5 items-center justify-center rounded-full"><Check size={8} strokeWidth={3} /></span>
            <span className="h-1.5 flex-1 rounded-full bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  ),
  "outbreak-investigation-platform": () => (
    <div className="flex w-full items-center justify-center gap-3 px-3">
      <div className="lg-sm w-[55%] rounded-xl px-3 py-2">
        <div className="font-medium">Fever in the last 3 days?</div>
        <div className="mt-1.5 flex gap-1.5">
          <span className="lg-accent rounded-full px-2 py-0.5">Yes</span>
          <span className="lg-sm rounded-full px-2 py-0.5">No</span>
        </div>
        <div className="mt-2 border-t border-line pt-1.5 text-ink-2">↳ Since which day?</div>
      </div>
      <div className="lg-sm relative flex size-20 items-center justify-center rounded-xl">
        <span className="absolute inset-3 rounded-full border border-dashed border-line-strong" />
        <MapPin size={20} className="text-[var(--human)]" aria-hidden />
      </div>
    </div>
  ),
  nutriplate: () => (
    <div className="flex w-full items-center justify-center gap-3 px-3">
      <div className="lg-sm relative flex size-24 items-center justify-center rounded-full">
        <span className="absolute left-5 top-6 size-7 rounded-full bg-[#f59e0b]/70" />
        <span className="absolute right-5 top-7 size-6 rounded-full bg-[#16a34a]/60" />
        <span className="absolute bottom-5 left-8 h-5 w-9 rounded-full bg-[#f5f5f4] ring-1 ring-black/10" />
        <ScanLine size={40} strokeWidth={1.25} className="relative text-accent" aria-hidden />
      </div>
      <div className="lg-sm w-[45%] space-y-1.5 rounded-xl px-3 py-2">
        <div className="font-medium">≈ 540 kcal</div>
        {[
          ["Protein", 0.55],
          ["Carbs", 0.8],
          ["Fat", 0.35],
        ].map(([k, v]) => (
          <div key={k as string} className="grid grid-cols-[3rem_1fr] items-center gap-2 text-ink-3">
            <span>{k}</span>
            <span className="h-1.5 rounded-full bg-ink/10">
              <span className="lg-accent block h-full rounded-full border-0" style={{ width: `${(v as number) * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
  "lab-report-grading-agent": () => (
    <div className="flex w-full items-center justify-center gap-2 px-3">
      <div className="lg-sm w-[30%] space-y-1.5 rounded-lg px-2.5 py-2.5">
        <div className="h-1.5 w-2/3 rounded-full bg-ink/20" />
        {[90, 75, 85, 60].map((w) => (
          <div key={w} className="h-1.5 rounded-full bg-ink/10" style={{ width: `${w}%` }} />
        ))}
      </div>
      <ArrowRight size={14} className="shrink-0 text-ink-3" aria-hidden />
      <div className="lg-sm w-[38%] rounded-xl px-2.5 py-2">
        {["Theory", "Method", "Conclusion"].map((r, i) => (
          <div key={r} className="mt-0.5 flex items-center justify-between">
            <span>{r}</span>
            <span className={`${i === 2 ? "lg-bad" : "lg-ok"} flex size-3.5 items-center justify-center rounded-full`}>
              {i === 2 ? "!" : <Check size={8} strokeWidth={3} />}
            </span>
          </div>
        ))}
      </div>
      <div className="lg-accent flex size-11 shrink-0 items-center justify-center rounded-full text-[0.9rem] font-medium">B+</div>
    </div>
  ),
  "rt06-citran-portal": () => (
    <div className="lg-sm w-[80%] overflow-hidden rounded-xl">
      <div className="flex items-center gap-1 border-b border-line px-2.5 py-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-ink/20" />
        ))}
        <span className="ml-2 h-1.5 w-24 rounded-full bg-ink/10" />
      </div>
      <div className="relative px-3 py-2.5">
        <div className="text-[0.85rem] font-medium">
          Kotagede heritage walk<span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-accent align-middle" />
        </div>
        <div className="mt-1.5 h-1.5 w-11/12 rounded-full bg-ink/10" />
        <div className="mt-1 h-1.5 w-3/4 rounded-full bg-ink/10" />
        <span className="lg-accent absolute right-2.5 top-2 flex items-center gap-1 rounded-full px-2 py-0.5">
          <Pencil size={10} aria-hidden /> Edit
        </span>
      </div>
    </div>
  ),
};

function Generic() {
  return <div className="lg-sm h-20 w-2/3 rounded-xl" />;
}
