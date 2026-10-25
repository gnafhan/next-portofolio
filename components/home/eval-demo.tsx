"use client";

import { motion } from "motion/react";
import { Check, GitPullRequest, LoaderCircle } from "lucide-react";
import { useLoop } from "./use-loop";

const SCENARIOS = [
  "Logs a receipt photo",
  "Splits 'coffee 25k and bread 15k'",
  "Answers a monthly total",
  "Refuses to invent a payment link",
  "Handles a voice note",
];
const DELAYS = [800, 700, 700, 700, 700, 700, 3000];

/** An agent change runs through scenario tests before it can merge. */
export function EvalDemo() {
  const [ref, step] = useLoop(DELAYS);
  const done = Math.max(0, step - 1);
  const passed = done >= SCENARIOS.length;
  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-center px-6 py-8 text-[0.85rem]">
      <div className="rounded-2xl border border-line bg-surface">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <GitPullRequest size={15} className="text-accent" aria-hidden />
          <span className="font-medium">Improve receipt parsing</span>
          <span className="ml-auto text-[0.75rem] text-ink-3">agent evals</span>
        </div>
        <ul className="px-4 py-2">
          {SCENARIOS.map((s, i) => (
            <li key={s} className="flex items-center gap-2.5 py-1.5">
              {i < done ? (
                <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="flex size-4 items-center justify-center rounded-full bg-[var(--ok)] text-white">
                  <Check size={10} strokeWidth={3} />
                </motion.span>
              ) : i === done && step > 0 ? (
                <LoaderCircle size={16} className="animate-spin text-ink-3" />
              ) : (
                <span className="size-4 rounded-full border border-line-strong" />
              )}
              <span className={i < done ? "text-ink" : "text-ink-3"}>{s}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-4 py-3 text-[0.8rem]">
          {passed ? (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-[var(--ok)]">
              All scenarios passed · ready to merge
            </motion.span>
          ) : (
            <span className="text-ink-3">Running {Math.min(done + 1, SCENARIOS.length)} of {SCENARIOS.length}…</span>
          )}
        </div>
      </div>
    </div>
  );
}
