"use client";

import { AnimatePresence, motion } from "motion/react";
import { Logo } from "../icons";
import { useLoop } from "./use-loop";

const DELAYS = [900, 1100, 1200, 1200, 3800];
const pop = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.3 } };

/** A finance question answered through a tool call instead of model arithmetic. */
export function ChatDemo() {
  const [ref, step] = useLoop(DELAYS);
  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-center gap-3 px-6 py-8 text-[0.88rem]">
      <motion.div {...pop} className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-white">
        How much did I spend on coffee this month?
      </motion.div>
      <div className="flex items-start gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full glass">
          <Logo size={15} />
        </span>
        <div className="flex min-h-[7.5rem] flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {step === 1 && (
              <motion.div key="dots" {...pop} className="flex gap-1 rounded-2xl glass px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-ink-3"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            )}
            {step >= 2 && (
              <motion.div key="tool" {...pop} className="w-fit rounded-xl glass-2 px-3 py-2 font-mono text-[0.78rem] text-ink-2">
                sum_expenses(category=&quot;coffee&quot;, month=&quot;Oct&quot;)
                {step >= 3 && <span className="ml-2 text-[var(--ok)]">→ 412,000 · 14 rows</span>}
              </motion.div>
            )}
            {step >= 4 && (
              <motion.div key="answer" {...pop} className="max-w-[90%] rounded-2xl rounded-tl-md glass px-4 py-2.5">
                You spent <b>Rp412k</b> on coffee in October, across 14 purchases.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
