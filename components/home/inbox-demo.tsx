"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, MessageCircle } from "lucide-react";
import { useLoop } from "./use-loop";

const MESSAGES = [
  { from: "Work chat", text: "can you check why the export is empty?", ticket: "Fix empty export" },
  { from: "Campus", text: "please upload the lab module by Friday", ticket: "Upload lab module" },
  { from: "Side project", text: "landing page typo on pricing", ticket: "Fix pricing typo" },
];
const DELAYS = [700, 700, 700, 1100, 800, 800, 800, 2600];

/** Requests scattered across chats become proposed tickets; a person approves each one. */
export function InboxDemo() {
  const [ref, step] = useLoop(DELAYS);
  const shown = Math.min(step, 3);
  const approved = Math.max(0, step - 4);
  return (
    <div ref={ref} className="grid h-full w-full grid-cols-2 gap-4 px-6 py-8 text-[0.82rem]">
      <div className="flex flex-col gap-2">
        <span className="label">Chats</span>
        <AnimatePresence>
          {MESSAGES.slice(0, shown).map((m) => (
            <motion.div
              key={m.from}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-line bg-surface px-3 py-2"
            >
              <div className="flex items-center gap-1.5 text-[0.72rem] text-ink-3">
                <MessageCircle size={12} aria-hidden /> {m.from}
              </div>
              <div className="mt-0.5 leading-snug">{m.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-2">
        <span className="label">Board</span>
        <AnimatePresence>
          {step >= 3 &&
            MESSAGES.map((m, i) => (
              <motion.div
                key={m.ticket}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.12 }}
                className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2"
              >
                <span className="leading-snug">{m.ticket}</span>
                {i < approved ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--ok)] text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-ink-3">approve?</span>
                )}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
