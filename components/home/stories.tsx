"use client";

import { motion } from "motion/react";
import { Check, Database, Hash, Mail, MessageCircle, Smartphone, Sparkles, Trash2, X } from "lucide-react";
import { cycle, useStart } from "../anim";

/* ------------------------------------------------------------------ */
/* 1. Requests scattered across apps fly, one by one, into one board   */
/* ------------------------------------------------------------------ */

const SOURCES = [
  { x: 14, label: "Chat", Icon: MessageCircle },
  { x: 38, label: "Email", Icon: Mail },
  { x: 62, label: "Group", Icon: Hash },
  { x: 86, label: "DM", Icon: Smartphone },
];
const TASKS = ["Fix the login bug", "Upload lab module", "Review the report", "Update the slides"];
const T1 = 13;

export function OneBoardStory() {
  const [ref, on] = useStart();
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden text-[0.8rem]">
      {SOURCES.map(({ x, label, Icon }, i) => {
        const appear = 1 + i * 2;
        return (
          <div key={label} className="absolute top-[8%] flex -translate-x-1/2 flex-col items-center gap-1" style={{ left: `${x}%` }}>
            <motion.span
              className="lg-sm flex size-10 items-center justify-center rounded-full text-ink-2"
              animate={on ? { scale: [1, 1, 1.18, 1, 1] } : undefined}
              transition={cycle(T1, [0, appear, appear + 0.3, appear + 0.7, T1])}
            >
              <Icon size={17} aria-hidden />
            </motion.span>
            <span className="text-[0.72rem] text-ink-3">{label}</span>
          </div>
        );
      })}

      <div className="lg-sm absolute left-1/2 top-[40%] h-[54%] w-[64%] -translate-x-1/2 rounded-2xl">
        <div className="flex items-center justify-between px-3 pt-2.5 text-[0.75rem]">
          <span className="font-medium">One board</span>
          <span className="text-ink-3">you approve</span>
        </div>
      </div>

      {TASKS.map((t, i) => {
        const appear = 1 + i * 2;
        const depart = appear + 0.7;
        const land = depart + 1.6;
        const rowTop = 52 + i * 10;
        const src = `${SOURCES[i].x}%`;
        return (
          <div key={t}>
            <motion.div
              className="lg-sm absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1"
              initial={{ left: src, top: "26%", opacity: 0 }}
              animate={
                on
                  ? {
                      left: [src, src, src, src, "50%", "50%", "50%"],
                      top: ["26%", "26%", "26%", "26%", `${rowTop}%`, `${rowTop}%`, `${rowTop}%`],
                      opacity: [0, 0, 1, 1, 1, 0, 0],
                      scale: [0.85, 0.85, 1, 1, 1, 1, 1],
                    }
                  : undefined
              }
              transition={cycle(T1, [0, appear, appear + 0.4, depart, land, land + 0.3, T1])}
            >
              {t}
            </motion.div>
            <motion.div
              className="absolute left-1/2 flex w-[58%] -translate-x-1/2 items-center justify-between rounded-lg px-2.5 py-1"
              style={{ top: `${rowTop}%` }}
              initial={{ opacity: 0 }}
              animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
              transition={cycle(T1, [0, land, land + 0.3, T1 - 0.8, T1])}
            >
              <span>{t}</span>
              <span className="lg-ok flex size-4 items-center justify-center rounded-full">
                <Check size={10} strokeWidth={3} />
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Hours of manual checking become minutes of review                */
/* ------------------------------------------------------------------ */

const T2 = 11;

export function HoursToMinutesStory() {
  const [ref, on] = useStart();
  return (
    <div ref={ref} className="relative grid h-full w-full grid-cols-[1.1fr_1fr] items-center gap-4 px-7 py-8">
      <div className="relative h-[200px]">
        {[2, 1].map((k) => (
          <div key={k} className="lg-sm absolute inset-0 rounded-xl" style={{ transform: `translate(${k * 10}px, ${-k * 10}px)` }} />
        ))}
        <div className="lg-sm absolute inset-0 overflow-hidden rounded-xl px-4 py-4">
          <div className="mb-3 h-2.5 w-1/2 rounded-full bg-ink/15" />
          {[0, 1, 2, 3, 4].map((i) => {
            const at = 1.2 + i * 1;
            return (
              <div key={i} className="mb-3 flex items-center gap-2">
                <motion.span
                  className="lg-ok flex size-4 shrink-0 items-center justify-center rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={on ? { scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] } : undefined}
                  transition={cycle(T2, [0, at, at + 0.3, T2 - 0.6, T2])}
                >
                  <Check size={10} strokeWidth={3} />
                </motion.span>
                <span className="h-2 rounded-full bg-ink/10" style={{ width: `${80 - i * 9}%` }} />
              </div>
            );
          })}
          <motion.span
            className="lg-accent absolute left-2 right-2 h-1 rounded-full"
            initial={{ top: "12%", opacity: 0 }}
            animate={on ? { top: ["12%", "12%", "90%", "90%", "12%"], opacity: [0, 1, 1, 0, 0] } : undefined}
            transition={cycle(T2, [0, 0.6, 6.2, 6.6, T2], "linear")}
          />
        </div>
      </div>

      <div className="text-center">
        <div className="text-[0.8rem] text-ink-3">Weekly grading time</div>
        <div className="relative mt-2 h-12">
          <motion.div
            className="absolute inset-0 text-[2rem] font-medium tracking-tight text-ink-3"
            animate={on ? { opacity: [1, 1, 0, 0, 1] } : undefined}
            transition={cycle(T2, [0, 6.4, 6.8, T2 - 0.4, T2])}
          >
            3 hours
          </motion.div>
          <motion.div
            className="absolute inset-0 text-[2rem] font-medium tracking-tight text-accent"
            initial={{ opacity: 0 }}
            animate={on ? { opacity: [0, 0, 1, 1, 0, 0] } : undefined}
            transition={cycle(T2, [0, 6.8, 7.2, T2 - 0.6, T2 - 0.4, T2])}
          >
            3 minutes
          </motion.div>
        </div>
        <motion.div
          className="lg-sm mx-auto mt-3 w-fit rounded-full px-3 py-1 text-[0.75rem] text-ink-2"
          initial={{ opacity: 0 }}
          animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
          transition={cycle(T2, [0, 7.4, 7.8, T2 - 0.6, T2])}
        >
          AI checks first, a person decides
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. A guess gets rejected; the answer comes from real records        */
/* ------------------------------------------------------------------ */

const T3 = 12;

export function TrustedAnswerStory() {
  const [ref, on] = useStart();
  const show = (from: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: on ? { opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] } : undefined,
    transition: cycle(T3, [0, from, from + 0.5, T3 - 0.6, T3]),
  });
  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-center gap-3 px-7 py-8 text-[0.85rem]">
      <motion.div {...show(0.4)} className="lg-accent ml-auto max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5">
        How much did I spend on coffee in October?
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div {...show(1.8)} className="lg-sm relative rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[0.72rem] text-ink-3">
            <Sparkles size={12} aria-hidden /> AI guessing
          </div>
          <motion.div
            className="mt-1 font-medium"
            animate={on ? { opacity: [1, 1, 0.35, 0.35, 1], textDecorationLine: ["none", "none", "line-through", "line-through", "none"] } : undefined}
            transition={cycle(T3, [0, 3.6, 4.0, T3 - 0.6, T3])}
          >
            “About Rp 500k”
          </motion.div>
          <motion.span
            className="lg-bad absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full"
            initial={{ scale: 0 }}
            animate={on ? { scale: [0, 0, 1, 1, 0] } : undefined}
            transition={cycle(T3, [0, 3.6, 4.0, T3 - 0.6, T3])}
          >
            <X size={11} strokeWidth={3} />
          </motion.span>
        </motion.div>

        <motion.div {...show(5)} className="lg-sm rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[0.72rem] text-ink-3">
            <Database size={12} aria-hidden /> Checks your records
          </div>
          <div className="mt-1 font-medium">14 receipts found</div>
        </motion.div>
      </div>

      <motion.div {...show(6.6)} className="lg-sm flex items-center gap-2.5 rounded-2xl rounded-tl-md px-4 py-2.5">
        <span className="lg-ok flex size-5 shrink-0 items-center justify-center rounded-full">
          <Check size={11} strokeWidth={3} />
        </span>
        <span>
          You spent <b>Rp 412.000</b>, from 14 receipts.
        </span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Each messy entry gets cleaned, labelled, and dropped in its box  */
/* ------------------------------------------------------------------ */

type Bucket = "coffee" | "transport" | "dropped";
const ENTRIES: { messy: string; clean: string; bucket: Bucket }[] = [
  { messy: "kopi 25rb", clean: "Coffee · 25k", bucket: "coffee" },
  { messy: "GRAB 350rb", clean: "Transport · 350k", bucket: "transport" },
  { messy: "kopi susu 18k", clean: "Coffee · 18k", bucket: "coffee" },
  { messy: "??? N/A", clean: "No amount", bucket: "dropped" },
];
const BUCKET_Y: Record<Bucket, number> = { coffee: 14, transport: 48, dropped: 76 };
const STEP = 3;
const T4 = 1 + ENTRIES.length * STEP + 2;
const landAt = (i: number) => 1 + i * STEP + 2.6;

/** Text that steps through values at given seconds of the cycle. */
function Counter({ values, at, on, className }: { values: string[]; at: number[]; on: boolean; className?: string }) {
  return (
    <span className={`relative block ${className ?? ""}`}>
      <span className="invisible">{values[values.length - 1]}</span>
      {values.map((v, k) => {
        const from = at[k];
        const to = k + 1 < at.length ? at[k + 1] : T4 - 0.5;
        return (
          <motion.span
            key={v}
            className="absolute inset-0"
            initial={{ opacity: k === 0 ? 1 : 0 }}
            animate={on ? { opacity: k === 0 ? [1, 1, 0, 0, 1] : [0, 0, 1, 1, 0, 0] } : undefined}
            transition={k === 0 ? cycle(T4, [0, to, to + 0.2, T4 - 0.3, T4]) : cycle(T4, [0, from, from + 0.2, to, to + 0.2, T4])}
          >
            {v}
          </motion.span>
        );
      })}
    </span>
  );
}

export function CleanDataStory() {
  const [ref, on] = useStart();
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden text-[0.74rem]">
      <span className="absolute left-[4%] top-[5%] text-[0.72rem] text-ink-3">Typed by people</span>
      <span className="absolute left-[68%] top-[5%] text-[0.72rem] text-ink-3">Sorted</span>

      {/* the cleaner in the middle */}
      <div className="lg-sm absolute left-[34.5%] top-[17%] flex h-[27%] w-[31%] flex-col items-center justify-end rounded-xl pb-2 text-center">
        <Sparkles size={14} className="text-accent" aria-hidden />
        <span className="mt-0.5 text-[0.7rem] text-ink-3">clean + label</span>
      </div>

      {/* buckets */}
      <div className="lg-sm absolute left-[68%] top-[12%] h-[30%] w-[29%] rounded-xl px-2.5 py-2">
        <div className="font-medium">Coffee</div>
        <Counter on={on} className="text-ink-2" values={["Rp 0", "Rp 25k", "Rp 43k"]} at={[0, landAt(0), landAt(2)]} />
      </div>
      <div className="lg-sm absolute left-[68%] top-[46%] h-[25%] w-[29%] rounded-xl px-2.5 py-2">
        <div className="font-medium">Transport</div>
        <Counter on={on} className="text-ink-2" values={["Rp 0", "Rp 350k"]} at={[0, landAt(1)]} />
      </div>
      <div className="lg-sm absolute left-[68%] top-[75%] h-[20%] w-[29%] rounded-xl px-2.5 py-2 text-[var(--human)]">
        <div className="flex items-center gap-1 font-medium">
          <Trash2 size={11} aria-hidden /> Dropped
        </div>
        <Counter on={on} values={["0 rows", "1 row"]} at={[0, landAt(3)]} />
      </div>

      {/* entries travel: list → cleaner → their box */}
      {ENTRIES.map((e, i) => {
        const go = 1 + i * STEP;
        const atCleaner = go + 0.9;
        const leave = go + 1.7;
        const land = landAt(i);
        const y0 = `${20 + i * 18}%`;
        const yb = `${BUCKET_Y[e.bucket] + 12}%`;
        return (
          <motion.div
            key={e.messy}
            className="lg-sm absolute z-10 w-[29%] rounded-lg px-2 py-1 text-center"
            initial={{ left: "4%", top: y0 }}
            animate={
              on
                ? {
                    left: ["4%", "4%", "35.5%", "35.5%", "68%", "68%", "68%", "4%"],
                    top: [y0, y0, "20%", "20%", yb, yb, yb, y0],
                    opacity: [1, 1, 1, 1, 1, 0, 0, 1],
                    scale: [1, 1, 1.04, 1.04, 1, 0.8, 0.8, 1],
                  }
                : undefined
            }
            transition={cycle(T4, [0, go, atCleaner, leave, land, land + 0.3, T4 - 0.4, T4])}
          >
            <span className="relative block">
              <motion.span
                className="block font-mono text-[var(--human)]"
                animate={on ? { opacity: [1, 1, 0, 0, 1] } : undefined}
                transition={cycle(T4, [0, atCleaner + 0.1, atCleaner + 0.4, T4 - 0.4, T4])}
              >
                {e.messy}
              </motion.span>
              <motion.span
                className={`absolute inset-0 block whitespace-nowrap font-medium ${e.bucket === "dropped" ? "text-[var(--human)]" : ""}`}
                initial={{ opacity: 0 }}
                animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
                transition={cycle(T4, [0, atCleaner + 0.2, atCleaner + 0.5, T4 - 0.4, T4])}
              >
                {e.clean}
              </motion.span>
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
