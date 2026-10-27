"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as m from "motion/react-m";
import { useScroll } from "motion/react";
import { BadgeCheck, Briefcase, FolderGit2, GraduationCap, Trophy, type LucideIcon } from "lucide-react";
import type { JourneyItem, JourneyKind } from "@/lib/journey";

const KIND: Record<JourneyKind, { Icon: LucideIcon; one: string; many: string }> = {
  study: { Icon: GraduationCap, one: "study", many: "study" },
  work: { Icon: Briefcase, one: "role", many: "roles" },
  project: { Icon: FolderGit2, one: "project", many: "projects" },
  award: { Icon: Trophy, one: "award", many: "awards" },
  cert: { Icon: BadgeCheck, one: "certificate", many: "certificates" },
};

/**
 * The years as a scroll story: the entry crossing the middle of the screen lights up, the big
 * year beside it rolls to match, and a rail fills as you go.
 */
export function Journey({ items }: { items: JourneyItem[] }) {
  const years = useMemo(() => [...new Set(items.map((i) => i.year))], [items]);
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLOListElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const setRow = useCallback((i: number, el: HTMLLIElement | null) => {
    rows.current[i] = el;
  }, []);
  const setCard = useCallback((i: number, el: HTMLDivElement | null) => {
    cards.current[i] = el;
  }, []);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 50%", "end 50%"] });

  useEffect(() => {
    // a thin band across the middle of the viewport decides which entry is "now"
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  // one highlight slides between entries (transform only) instead of every row restyling itself
  useEffect(() => {
    const place = () => {
      const el = cards.current[active];
      if (!el || !glow.current) return;
      glow.current.style.transform = `translateY(${el.offsetTop}px)`;
      glow.current.style.height = `${el.offsetHeight}px`;
      glow.current.style.opacity = "1";
    };
    place();
    const ro = new ResizeObserver(place);
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [active]);

  const year = items[active]?.year ?? years[0];
  const yi = years.indexOf(year);
  const counts = (Object.keys(KIND) as JourneyKind[])
    .map((k) => ({ k, n: items.filter((i) => i.year === year && i.kind === k).length }))
    .filter((c) => c.n);

  const jump = (y: number) => {
    const i = items.findIndex((it) => it.year === y);
    rows.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
      {/* the year, pinned while the list scrolls: a slim bar on phones, a big panel beside the list on desktop */}
      <div className="glass sticky top-[68px] z-10 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 lg:hidden">
        <YearRoller years={years} index={yi} size="sm" />
        <Counts counts={counts} />
      </div>
      <div className="sticky top-28 hidden self-start lg:block">
        <YearRoller years={years} index={yi} size="lg" />
        <div className="mt-5">
          <Counts counts={counts} />
        </div>
        <div className="mt-8 flex gap-2">
          {years.map((y, i) => (
            <button
              key={y}
              type="button"
              onClick={() => jump(y)}
              data-agent={`journey-year-${y}`}
              className={`rounded-full px-3 py-1 text-[0.85rem] tabular-nums transition-colors ${
                i === yi ? "lg-sm font-medium text-accent" : "text-ink-3 hover:text-ink"
              }`}
              aria-current={i === yi ? "step" : undefined}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* entries on a rail that fills as you scroll */}
      <div className="relative">
        <div className="absolute bottom-0 left-[17px] top-0 w-px bg-line" aria-hidden />
        <m.div className="absolute left-[17px] top-0 h-full w-px origin-top bg-accent" style={{ scaleY: scrollYProgress }} aria-hidden />
        <div
          ref={glow}
          aria-hidden
          className="glass-static pointer-events-none absolute left-[51px] right-0 top-0 rounded-2xl opacity-0 transition-[transform,height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        />
        <ol ref={listRef} className="relative space-y-2.5">
          {items.map((it, i) => (
            <Row
              key={`${it.kind}-${it.title}-${it.period}`}
              it={it}
              i={i}
              on={i === active}
              gap={i > 0 && items[i - 1].year !== it.year}
              setRow={setRow}
              setCard={setCard}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

/** One entry; memoised so moving the highlight only re-renders the two rows that change. */
const Row = memo(function Row({
  it,
  i,
  on,
  gap,
  setRow,
  setCard,
}: {
  it: JourneyItem;
  i: number;
  on: boolean;
  gap: boolean;
  setRow: (i: number, el: HTMLLIElement | null) => void;
  setCard: (i: number, el: HTMLDivElement | null) => void;
}) {
  const { Icon } = KIND[it.kind];
  const body = (
    <>
      <div className="min-w-0 flex-1">
        <div className="font-medium leading-snug">{it.title}</div>
        <div className="mt-0.5 text-[0.92rem] text-ink-2">{it.sub}</div>
      </div>
      <span className="shrink-0 pt-0.5 text-[0.85rem] tabular-nums text-ink-3">{it.period}</span>
    </>
  );
  return (
    <li
      ref={(el) => setRow(i, el)}
      data-i={i}
      data-agent={`journey-${it.year}-${i}`}
      className={`flex gap-4 ${gap ? "pt-8" : ""}`}
    >
      <span
        className={`relative z-[1] mt-2 flex size-[35px] shrink-0 items-center justify-center rounded-[11px] transition-[background-color,color,box-shadow,transform] duration-300 ${
          on ? "lg-accent scale-110" : "lg-sm text-ink-2"
        }`}
      >
        <Icon size={16} aria-hidden />
      </span>
      <div
        ref={(el) => setCard(i, el)}
        className="relative min-w-0 flex-1"
      >
        {it.href ? (
          <Link href={it.href} className="flex items-start gap-3 px-4 py-3 hover:text-accent">
            {body}
          </Link>
        ) : (
          <div className="flex items-start gap-3 px-4 py-3">{body}</div>
        )}
      </div>
    </li>
  );
});

/** A rolling counter: every year sits in a column that slides so only the current one shows. */
function YearRoller({ years, index, size }: { years: number[]; index: number; size: "sm" | "lg" }) {
  const h = size === "lg" ? "h-[8.5rem] text-[8.5rem]" : "h-[2.6rem] text-[2.4rem]";
  return (
    <div className={`shrink-0 overflow-hidden whitespace-nowrap ${h.split(" ")[0]}`} aria-live="polite">
      <div
        className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateY(-${(index * 100) / years.length}%)` }}
      >
        {years.map((y) => (
          <div key={y} className={`${h} font-medium leading-none tracking-tighter tabular-nums`} aria-hidden={y !== years[index]}>
            {y}
          </div>
        ))}
      </div>
    </div>
  );
}

function Counts({ counts }: { counts: { k: JourneyKind; n: number }[] }) {
  return (
    <div className="flex flex-wrap justify-end gap-1.5 lg:justify-start">
      {counts.map(({ k, n }) => {
        const { Icon, one, many } = KIND[k];
        return (
          <span key={k} className="lg-sm flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.82rem]">
            <Icon size={13} aria-hidden /> {n} {n === 1 ? one : many}
          </span>
        );
      })}
    </div>
  );
}
