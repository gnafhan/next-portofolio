"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Check, Database, Hash, Mail, MessageCircle, Smartphone, Sparkles, X } from "lucide-react";

/** Plays looping keyframes only while the illustration is on screen. */
function useOnScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { amount: 0.35 });
  return [ref, on] as const;
}

function loop(duration: number, times: number[], delay = 0) {
  return { duration, times, delay, repeat: Infinity, ease: "easeInOut" as const };
}

/* ------------------------------------------------------------------ */
/* 1. Requests scattered across apps fly into one board                */
/* ------------------------------------------------------------------ */

const SOURCES = [
  { x: 14, label: "Chat", Icon: MessageCircle },
  { x: 38, label: "Email", Icon: Mail },
  { x: 62, label: "Group", Icon: Hash },
  { x: 86, label: "DM", Icon: Smartphone },
];
const TASKS = ["Fix the login bug", "Upload lab module", "Review the report", "Update the slides"];
const T1 = 8;

export function OneBoardStory() {
  const [ref, on] = useOnScreen();
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden text-[0.8rem]">
      {SOURCES.map(({ x, label, Icon }) => (
        <div key={label} className="absolute top-[8%] flex -translate-x-1/2 flex-col items-center gap-1" style={{ left: `${x}%` }}>
          <span className="lg-sm flex size-10 items-center justify-center rounded-full text-ink-2">
            <Icon size={17} aria-hidden />
          </span>
          <span className="text-[0.72rem] text-ink-3">{label}</span>
        </div>
      ))}

      <div className="lg-sm absolute left-1/2 top-[40%] h-[54%] w-[64%] -translate-x-1/2 rounded-2xl">
        <div className="flex items-center justify-between px-3 pt-2.5 text-[0.75rem]">
          <span className="font-medium">One board</span>
          <span className="text-ink-3">you approve</span>
        </div>
      </div>

      {TASKS.map((t, i) => {
        const start = 0.6 + i * 0.9;
        const land = start + 1.2;
        const rowTop = 52 + i * 10;
        return (
          <div key={t}>
            {/* flying request */}
            <motion.div
              className="lg-sm absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1"
              initial={{ left: `${SOURCES[i].x}%`, top: "26%", opacity: 0, scale: 0.9 }}
              animate={
                on
                  ? {
                      left: [`${SOURCES[i].x}%`, `${SOURCES[i].x}%`, `${SOURCES[i].x}%`, "50%", "50%", "50%"],
                      top: ["26%", "26%", "26%", `${rowTop}%`, `${rowTop}%`, `${rowTop}%`],
                      opacity: [0, 0, 1, 1, 0, 0],
                      scale: [0.9, 0.9, 1, 1, 1, 1],
                    }
                  : undefined
              }
              transition={loop(T1, [0, (start - 0.3) / T1, start / T1, land / T1, (land + 0.25) / T1, 1])}
            >
              {t}
            </motion.div>
            {/* landed row */}
            <motion.div
              className="absolute left-1/2 flex w-[58%] -translate-x-1/2 items-center justify-between rounded-lg px-2.5 py-1"
              style={{ top: `${rowTop}%` }}
              initial={{ opacity: 0 }}
              animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
              transition={loop(T1, [0, land / T1, (land + 0.25) / T1, 0.95, 1])}
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

const T2 = 6;

export function HoursToMinutesStory() {
  const [ref, on] = useOnScreen();
  return (
    <div ref={ref} className="relative grid h-full w-full grid-cols-[1.1fr_1fr] items-center gap-4 px-7 py-8">
      {/* stack of reports being checked */}
      <div className="relative h-[200px]">
        {[2, 1].map((k) => (
          <div key={k} className="lg-sm absolute inset-0 rounded-xl" style={{ transform: `translate(${k * 10}px, ${-k * 10}px)` }} />
        ))}
        <div className="lg-sm absolute inset-0 overflow-hidden rounded-xl px-4 py-4">
          <div className="mb-3 h-2.5 w-1/2 rounded-full bg-ink/15" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="mb-3 flex items-center gap-2">
              <motion.span
                className="lg-ok flex size-4 shrink-0 items-center justify-center rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={on ? { scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] } : undefined}
                transition={loop(T2, [0, (0.6 + i * 0.45) / T2, (0.8 + i * 0.45) / T2, 0.92, 1])}
              >
                <Check size={10} strokeWidth={3} />
              </motion.span>
              <span className="h-2 rounded-full bg-ink/10" style={{ width: `${80 - i * 9}%` }} />
            </div>
          ))}
          {/* scan line */}
          <motion.span
            className="lg-accent absolute left-2 right-2 h-1 rounded-full"
            initial={{ top: "12%" }}
            animate={on ? { top: ["12%", "90%", "90%"], opacity: [1, 1, 0] } : undefined}
            transition={loop(T2, [0, 0.55, 1])}
          />
        </div>
      </div>

      {/* time counter */}
      <div className="text-center">
        <div className="text-[0.8rem] text-ink-3">Weekly grading time</div>
        <div className="relative mt-2 h-12">
          <motion.div
            className="absolute inset-0 text-[2rem] font-medium tracking-tight text-ink-3"
            animate={on ? { opacity: [1, 1, 0, 0, 1] } : undefined}
            transition={loop(T2, [0, 0.5, 0.55, 0.96, 1])}
          >
            3 hours
          </motion.div>
          <motion.div
            className="absolute inset-0 text-[2rem] font-medium tracking-tight text-accent"
            initial={{ opacity: 0 }}
            animate={on ? { opacity: [0, 0, 1, 1, 0], scale: [0.9, 0.9, 1, 1, 0.9] } : undefined}
            transition={loop(T2, [0, 0.56, 0.62, 0.95, 1])}
          >
            3 minutes
          </motion.div>
        </div>
        <motion.div
          className="lg-sm mx-auto mt-3 w-fit rounded-full px-3 py-1 text-[0.75rem] text-ink-2"
          initial={{ opacity: 0 }}
          animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
          transition={loop(T2, [0, 0.62, 0.7, 0.95, 1])}
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

const T3 = 7;

export function TrustedAnswerStory() {
  const [ref, on] = useOnScreen();
  const at = (a: number, b: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: on ? { opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] } : undefined,
    transition: loop(T3, [0, a / T3, b / T3, 0.94, 1]),
  });
  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-center gap-3 px-7 py-8 text-[0.85rem]">
      <motion.div {...at(0.1, 0.5)} className="lg-accent ml-auto max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5">
        How much did I spend on coffee in October?
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {/* the guess */}
        <motion.div {...at(1.0, 1.4)} className="lg-sm relative rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[0.72rem] text-ink-3">
            <Sparkles size={12} aria-hidden /> AI guessing
          </div>
          <motion.div
            className="mt-1 font-medium"
            animate={on ? { opacity: [1, 1, 0.35, 0.35, 1], textDecorationLine: ["none", "none", "line-through", "line-through", "none"] } : undefined}
            transition={loop(T3, [0, 2.2 / T3, 2.5 / T3, 0.94, 1])}
          >
            “About Rp 500k”
          </motion.div>
          <motion.span
            className="lg-bad absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full"
            initial={{ scale: 0 }}
            animate={on ? { scale: [0, 0, 1, 1, 0] } : undefined}
            transition={loop(T3, [0, 2.2 / T3, 2.5 / T3, 0.94, 1])}
          >
            <X size={11} strokeWidth={3} />
          </motion.span>
        </motion.div>

        {/* the lookup */}
        <motion.div {...at(2.8, 3.2)} className="lg-sm rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[0.72rem] text-ink-3">
            <Database size={12} aria-hidden /> Checks your records
          </div>
          <div className="mt-1 font-medium">14 receipts found</div>
        </motion.div>
      </div>

      <motion.div {...at(3.9, 4.3)} className="lg-sm flex items-center gap-2.5 rounded-2xl rounded-tl-md px-4 py-2.5">
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
/* 4. Messy values snap into a clean table, then a chart               */
/* ------------------------------------------------------------------ */

const CELLS = [
  { messy: "12/10/26", clean: "Oct 12", from: [8, 12, -12], to: [6, 30] },
  { messy: "Rp1,2jt", clean: "1,200,000", from: [40, 6, 9], to: [24, 30] },
  { messy: " kopi", clean: "Coffee", from: [70, 16, -6], to: [42, 30] },
  { messy: "13-Okt", clean: "Oct 13", from: [14, 70, 8], to: [6, 48] },
  { messy: "350rb", clean: "350,000", from: [46, 78, -10], to: [24, 48] },
  { messy: "grab", clean: "Transport", from: [74, 66, 12], to: [42, 48] },
];
const T4 = 7;

export function CleanDataStory() {
  const [ref, on] = useOnScreen();
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden font-mono text-[0.72rem]">
      {CELLS.map((c) => (
        <motion.div
          key={c.messy}
          className="lg-sm absolute w-[17%] rounded-md px-2 py-1 text-center"
          initial={{ left: `${c.from[0]}%`, top: `${c.from[1]}%`, rotate: c.from[2] }}
          animate={
            on
              ? {
                  left: [`${c.from[0]}%`, `${c.from[0]}%`, `${c.to[0]}%`, `${c.to[0]}%`, `${c.from[0]}%`],
                  top: [`${c.from[1]}%`, `${c.from[1]}%`, `${c.to[1]}%`, `${c.to[1]}%`, `${c.from[1]}%`],
                  rotate: [c.from[2], c.from[2], 0, 0, c.from[2]],
                }
              : undefined
          }
          transition={loop(T4, [0, 0.15, 0.32, 0.93, 1])}
        >
          <span className="relative block">
            <motion.span
              className="block text-[var(--human)]"
              animate={on ? { opacity: [1, 1, 0, 0, 1] } : undefined}
              transition={loop(T4, [0, 0.3, 0.36, 0.93, 1])}
            >
              {c.messy}
            </motion.span>
            <motion.span
              className="absolute inset-0 block"
              initial={{ opacity: 0 }}
              animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
              transition={loop(T4, [0, 0.3, 0.36, 0.93, 1])}
            >
              {c.clean}
            </motion.span>
          </span>
        </motion.div>
      ))}

      {/* the row that can't be trusted gets dropped */}
      <motion.div
        className="lg-bad absolute left-[6%] top-[66%] w-[53%] rounded-md px-2 py-1 text-center"
        initial={{ opacity: 0 }}
        animate={on ? { opacity: [0, 0, 1, 0, 0] } : undefined}
        transition={loop(T4, [0, 0.36, 0.42, 0.52, 1])}
      >
        N/A · no date → dropped
      </motion.div>

      {/* chart */}
      <div className="lg-sm absolute bottom-[12%] right-[5%] top-[18%] flex w-[30%] items-end justify-around gap-2 rounded-xl px-3 pb-3 pt-6">
        <span className="absolute left-3 top-2 font-sans text-[0.72rem] text-ink-3">Spending</span>
        {[0.9, 0.35, 0.6].map((h, i) => (
          <motion.span
            key={i}
            className="lg-accent w-full rounded-md"
            initial={{ height: "4%" }}
            animate={on ? { height: ["4%", "4%", `${h * 100}%`, `${h * 100}%`, "4%"] } : undefined}
            transition={loop(T4, [0, 0.45 + i * 0.04, 0.6 + i * 0.04, 0.93, 1])}
          />
        ))}
      </div>
    </div>
  );
}
