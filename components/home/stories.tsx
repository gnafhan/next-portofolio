"use client";

import * as m from "motion/react-m";
import { Check, Database, Sparkles, Trash2, X } from "lucide-react";
import { AppLogo } from "../app-logos";
import { cycle, useStart } from "../anim";

/* ------------------------------------------------------------------ */
/* 1. Messages from many apps become tasks on one to-do list           */
/* ------------------------------------------------------------------ */

const LOGOS = ["whatsapp", "gmail", "slack", "discord", "telegram", "instagram", "line", "messenger"];
const logoX = (k: number) => 7 + k * 12.3;
const REQUESTS = [
  { app: "whatsapp", from: 0, msg: "the export is empty, help?", task: "Fix empty export" },
  { app: "gmail", from: 1, msg: "slides for Friday please", task: "Update Friday slides" },
  { app: "slack", from: 2, msg: "PR #42 needs a review", task: "Review PR #42" },
  { app: "discord", from: 3, msg: "lab module isn't up yet", task: "Upload lab module" },
];
const STEP1 = 3;
const T1 = 1 + REQUESTS.length * STEP1 + 2.5;

/** Text that swaps between values at given seconds of a cycle. */
function Steps({ values, at, total, on, className }: { values: string[]; at: number[]; total: number; on: boolean; className?: string }) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span className="invisible">{values.reduce((a, b) => (b.length > a.length ? b : a))}</span>
      {values.map((v, k) => {
        const from = at[k];
        const to = k + 1 < at.length ? at[k + 1] : total - 0.5;
        return (
          <m.span
            key={v}
            className="absolute inset-0 whitespace-nowrap"
            initial={{ opacity: k === 0 ? 1 : 0 }}
            animate={on ? { opacity: k === 0 ? [1, 1, 0, 0, 1] : [0, 0, 1, 1, 0, 0] } : undefined}
            transition={k === 0 ? cycle(total, [0, to, to + 0.2, total - 0.3, total]) : cycle(total, [0, from, from + 0.2, to, to + 0.2, total])}
          >
            {v}
          </m.span>
        );
      })}
    </span>
  );
}

export function OneBoardStory() {
  const [ref, on] = useStart();
  const landAt = (i: number) => 1 + i * STEP1 + 2.4;
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden text-[0.78rem]">
      {/* where requests come from */}
      {LOGOS.map((app, k) => {
        const req = REQUESTS.find((r) => r.from === k);
        const t = req ? 1 + REQUESTS.indexOf(req) * STEP1 : -1;
        return (
          <m.span
            key={app}
            className="lg-sm absolute top-[5%] flex size-8 -translate-x-1/2 items-center justify-center rounded-xl text-ink"
            style={{ left: `${logoX(k)}%` }}
            animate={on && req ? { scale: [1, 1, 1.2, 1, 1] } : undefined}
            transition={req ? cycle(T1, [0, t, t + 0.3, t + 0.7, T1]) : undefined}
          >
            <AppLogo app={app} size={15} />
          </m.span>
        );
      })}

      {/* the assistant in between */}
      <div className="lg-sm absolute left-1/2 top-[30%] flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[0.72rem] text-ink-2">
        <Sparkles size={12} className="text-accent" aria-hidden /> AI turns messages into tasks
      </div>

      {/* where they end up */}
      <div className="lg-sm absolute left-1/2 top-[45%] h-[51%] w-[74%] -translate-x-1/2 rounded-2xl px-3 pt-2">
        <div className="flex items-center justify-between text-[0.75rem]">
          <span className="font-medium">My to-do list</span>
          <Steps
            on={on}
            total={T1}
            className="text-ink-3"
            values={["0 tasks", "1 task", "2 tasks", "3 tasks", "4 tasks"]}
            at={[0, landAt(0), landAt(1), landAt(2), landAt(3)]}
          />
        </div>
      </div>

      {REQUESTS.map((r, i) => {
        const appear = 1 + i * STEP1;
        const atAi = appear + 1.3;
        const land = landAt(i);
        const rowTop = 55 + i * 9.5;
        const src = `${logoX(r.from)}%`;
        return (
          <div key={r.task}>
            {/* message → task */}
            <m.div
              className="lg-sm absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1"
              initial={{ left: src, top: "17%", opacity: 0 }}
              animate={
                on
                  ? {
                      left: [src, src, src, "50%", "50%", "50%", "50%", "50%"],
                      top: ["17%", "17%", "17%", "29%", "29%", `${rowTop}%`, `${rowTop}%`, `${rowTop}%`],
                      opacity: [0, 0, 1, 1, 1, 1, 0, 0],
                    }
                  : undefined
              }
              transition={cycle(T1, [0, appear, appear + 0.4, atAi, atAi + 0.5, land, land + 0.25, T1])}
            >
              <Steps on={on} total={T1} values={[`“${r.msg}”`, r.task]} at={[0, atAi + 0.1]} />
            </m.div>
            {/* the task row it becomes */}
            <m.div
              className="absolute left-1/2 flex w-[68%] -translate-x-1/2 items-center gap-2 rounded-lg px-2 py-1"
              style={{ top: `${rowTop}%` }}
              initial={{ opacity: 0 }}
              animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
              transition={cycle(T1, [0, land, land + 0.25, T1 - 0.6, T1])}
            >
              <span className="size-3.5 shrink-0 rounded border border-line-strong" />
              <span className="flex-1 truncate">{r.task}</span>
              <AppLogo app={r.app} size={12} className="shrink-0 text-ink-3" />
            </m.div>
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
                <m.span
                  className="lg-ok flex size-4 shrink-0 items-center justify-center rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={on ? { scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] } : undefined}
                  transition={cycle(T2, [0, at, at + 0.3, T2 - 0.6, T2])}
                >
                  <Check size={10} strokeWidth={3} />
                </m.span>
                <span className="h-2 rounded-full bg-ink/10" style={{ width: `${80 - i * 9}%` }} />
              </div>
            );
          })}
          <m.span
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
          <m.div
            className="absolute inset-0 text-[2rem] font-medium tracking-tight text-ink-3"
            animate={on ? { opacity: [1, 1, 0, 0, 1] } : undefined}
            transition={cycle(T2, [0, 6.4, 6.8, T2 - 0.4, T2])}
          >
            3 hours
          </m.div>
          <m.div
            className="absolute inset-0 text-[2rem] font-medium tracking-tight text-accent"
            initial={{ opacity: 0 }}
            animate={on ? { opacity: [0, 0, 1, 1, 0, 0] } : undefined}
            transition={cycle(T2, [0, 6.8, 7.2, T2 - 0.6, T2 - 0.4, T2])}
          >
            3 minutes
          </m.div>
        </div>
        <m.div
          className="lg-sm mx-auto mt-3 w-fit rounded-full px-3 py-1 text-[0.75rem] text-ink-2"
          initial={{ opacity: 0 }}
          animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
          transition={cycle(T2, [0, 7.4, 7.8, T2 - 0.6, T2])}
        >
          AI checks first, a person decides
        </m.div>
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
      <m.div {...show(0.4)} className="lg-accent ml-auto max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5">
        How much did I spend on coffee in October?
      </m.div>

      <div className="grid grid-cols-2 gap-3">
        <m.div {...show(1.8)} className="lg-sm relative rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[0.72rem] text-ink-3">
            <Sparkles size={12} aria-hidden /> AI guessing
          </div>
          <m.div
            className="mt-1 font-medium"
            animate={on ? { opacity: [1, 1, 0.35, 0.35, 1], textDecorationLine: ["none", "none", "line-through", "line-through", "none"] } : undefined}
            transition={cycle(T3, [0, 3.6, 4.0, T3 - 0.6, T3])}
          >
            “About Rp 500k”
          </m.div>
          <m.span
            className="lg-bad absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full"
            initial={{ scale: 0 }}
            animate={on ? { scale: [0, 0, 1, 1, 0] } : undefined}
            transition={cycle(T3, [0, 3.6, 4.0, T3 - 0.6, T3])}
          >
            <X size={11} strokeWidth={3} />
          </m.span>
        </m.div>

        <m.div {...show(5)} className="lg-sm rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[0.72rem] text-ink-3">
            <Database size={12} aria-hidden /> Checks your records
          </div>
          <div className="mt-1 font-medium">14 receipts found</div>
        </m.div>
      </div>

      <m.div {...show(6.6)} className="lg-sm flex items-center gap-2.5 rounded-2xl rounded-tl-md px-4 py-2.5">
        <span className="lg-ok flex size-5 shrink-0 items-center justify-center rounded-full">
          <Check size={11} strokeWidth={3} />
        </span>
        <span>
          You spent <b>Rp 412.000</b>, from 14 receipts.
        </span>
      </m.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Each messy entry passes the cleaner and drops into its category  */
/* ------------------------------------------------------------------ */

type Bucket = "coffee" | "transport" | "dropped";
const ENTRIES: { messy: string; clean: string; bucket: Bucket }[] = [
  { messy: "kopi 25rb", clean: "Coffee · 25k", bucket: "coffee" },
  { messy: "GRAB 350rb", clean: "Transport · 350k", bucket: "transport" },
  { messy: "kopi susu 18k", clean: "Coffee · 18k", bucket: "coffee" },
  { messy: "??? N/A", clean: "No amount", bucket: "dropped" },
];
const BUCKET_Y: Record<Bucket, number> = { coffee: 22, transport: 54, dropped: 80 };
const STEP4 = 3;
const T4 = 1 + ENTRIES.length * STEP4 + 2;
const landAt4 = (i: number) => 1 + i * STEP4 + 2.4;

export function CleanDataStory() {
  const [ref, on] = useStart();
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden text-[0.74rem]">
      <span className="absolute left-[4%] top-[5%] text-[0.72rem] text-ink-3">Typed by people</span>
      <span className="absolute left-[36%] top-[5%] flex items-center gap-1 text-[0.72rem] text-ink-3">
        <Sparkles size={11} className="text-accent" aria-hidden /> AI cleans
      </span>
      <span className="absolute left-[68%] top-[5%] text-[0.72rem] text-ink-3">Sorted</span>

      {/* the cleaning gate every row passes through */}
      <div className="lg-sm absolute left-[38%] top-[14%] h-[80%] w-[9%] rounded-full" />

      {/* category boxes */}
      <div className="lg-sm absolute left-[68%] top-[14%] h-[29%] w-[29%] rounded-xl px-2.5 py-2">
        <div className="font-medium">Coffee</div>
        <Steps on={on} total={T4} className="text-ink-2" values={["Rp 0", "Rp 25k", "Rp 43k"]} at={[0, landAt4(0), landAt4(2)]} />
      </div>
      <div className="lg-sm absolute left-[68%] top-[47%] h-[24%] w-[29%] rounded-xl px-2.5 py-2">
        <div className="font-medium">Transport</div>
        <Steps on={on} total={T4} className="text-ink-2" values={["Rp 0", "Rp 350k"]} at={[0, landAt4(1)]} />
      </div>
      <div className="lg-sm absolute left-[68%] top-[75%] h-[19%] w-[29%] rounded-xl px-2.5 py-2 text-[var(--human)]">
        <div className="flex items-center gap-1 font-medium">
          <Trash2 size={11} aria-hidden /> Dropped
        </div>
        <Steps on={on} total={T4} values={["0 rows", "1 row"]} at={[0, landAt4(3)]} />
      </div>

      {ENTRIES.map((e, i) => {
        const go = 1 + i * STEP4;
        const inGate = go + 0.7;
        const out = go + 1.3;
        const land = landAt4(i);
        const y0 = `${18 + i * 19}%`;
        const yb = `${BUCKET_Y[e.bucket]}%`;
        return (
          <m.div
            key={e.messy}
            className="lg-sm absolute z-10 w-[29%] rounded-lg px-2 py-1 text-center"
            initial={{ left: "4%", top: y0 }}
            animate={
              on
                ? {
                    left: ["4%", "4%", "28%", "36%", "68%", "68%", "68%", "4%", "4%"],
                    top: [y0, y0, y0, y0, yb, yb, yb, y0, y0],
                    opacity: [1, 1, 1, 1, 1, 0, 0, 0, 1],
                  }
                : undefined
            }
            transition={cycle(T4, [0, go, inGate, out, land, land + 0.3, T4 - 0.5, T4 - 0.49, T4])}
          >
            <Steps
              on={on}
              total={T4}
              className={`font-medium ${e.bucket === "dropped" ? "text-[var(--human)]" : ""}`}
              values={[e.messy, e.clean]}
              at={[0, inGate + 0.2]}
            />
          </m.div>
        );
      })}
    </div>
  );
}
