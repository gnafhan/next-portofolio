"use client";

import { motion } from "motion/react";
import { useLoop } from "./use-loop";

const ROWS = [
  { raw: ["12/10/26", "Rp 1,2 jt", "kopi "], clean: ["2026-10-12", "1,200,000", "Coffee"] },
  { raw: ["13-Oct", "350rb", "GRAB"], clean: ["2026-10-13", "350,000", "Transport"] },
  { raw: ["", "N/A", "makan siang"], clean: ["dropped", "", "missing date"] },
  { raw: ["14 okt", "75.000", "Kopi"], clean: ["2026-10-14", "75,000", "Coffee"] },
];
const BARS = [{ label: "Coffee", v: 1275 }, { label: "Transport", v: 350 }, { label: "Food", v: 620 }];
const DELAYS = [1400, 1600, 3200];

/** Messy rows get normalized, invalid ones dropped, and the result feeds a chart. */
export function PipelineDemo() {
  const [ref, step] = useLoop(DELAYS);
  const cleaned = step >= 1;
  const charted = step >= 2;
  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-center gap-4 px-6 py-8">
      <div className="overflow-hidden rounded-2xl glass font-mono text-[0.75rem]">
        {ROWS.map((r, i) => {
          const dropped = cleaned && r.clean[0] === "dropped";
          const cells = cleaned ? r.clean : r.raw;
          return (
            <motion.div
              key={i}
              animate={{ opacity: dropped ? 0.35 : 1 }}
              className={`grid grid-cols-[1fr_1fr_1fr] gap-2 px-3 py-1.5 ${i ? "border-t border-line" : ""} ${dropped ? "line-through" : ""}`}
            >
              {cells.map((c, j) => (
                <motion.span key={`${cleaned}-${j}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cleaned ? "text-ink" : "text-[var(--human)]"}>
                  {c || "∅"}
                </motion.span>
              ))}
            </motion.div>
          );
        })}
      </div>
      <div className="space-y-1.5 rounded-2xl glass px-4 py-3 text-[0.78rem]">
        {BARS.map((b) => (
          <div key={b.label} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
            <span className="text-ink-3">{b.label}</span>
            <motion.span
              className="h-2.5 rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: charted ? `${(b.v / 1275) * 100}%` : 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
