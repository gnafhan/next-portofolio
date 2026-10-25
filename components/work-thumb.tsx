"use client";

import { motion } from "motion/react";
import { Check, Database, MapPin, Pencil, ScanLine, Sparkles } from "lucide-react";
import { AppLogo } from "./app-logos";
import { cycle, useStart } from "./anim";

/** Small looping motion graphic for each case study card. */
export function WorkThumb({ slug }: { slug: string }) {
  const [ref, on] = useStart(0.5);
  const Scene = SCENES[slug] ?? Generic;
  return (
    <div ref={ref} className="relative h-40 overflow-hidden rounded-xl text-[0.72rem]">
      <Scene on={on} />
    </div>
  );
}

type SceneProps = { on: boolean };

/** fade/slide in at `from`, stay until near the end of the cycle */
function enter(on: boolean, T: number, from: number, y = 6) {
  return {
    initial: { opacity: 0, y },
    animate: on ? { opacity: [0, 0, 1, 1, 0], y: [y, y, 0, 0, 0] } : undefined,
    transition: cycle(T, [0, from, from + 0.5, T - 0.6, T]),
  };
}

const SCENES: Record<string, (p: SceneProps) => React.ReactNode> = {
  /* chat message → live status → new row in the database → confirmation reply */
  catataja: ({ on }) => {
    const T = 10;
    const status = [
      { at: 1.2, text: "Reading…", Icon: Sparkles, cls: "lg-sm text-ink-2" },
      { at: 2.6, text: "Saving to DB…", Icon: Database, cls: "lg-sm text-ink-2" },
      { at: 4, text: "Saved", Icon: Check, cls: "lg-ok" },
    ];
    return (
      <div className="absolute inset-0 grid grid-cols-[1.05fr_0.95fr] gap-3 px-3 py-3">
        {/* chat side */}
        <div className="flex flex-col gap-1.5">
          <motion.div {...enter(on, T, 0.4)} className="lg-accent ml-auto w-fit rounded-2xl rounded-br-md px-3 py-1.5">
            coffee 25k
          </motion.div>
          <div className="relative h-6">
            {status.map((st, i) => {
              const to = i + 1 < status.length ? status[i + 1].at : T - 0.6;
              return (
                <motion.span
                  key={st.text}
                  className={`${st.cls} absolute right-0 top-0 flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5`}
                  initial={{ opacity: 0 }}
                  animate={on ? { opacity: [0, 0, 1, 1, 0, 0] } : undefined}
                  transition={cycle(T, [0, st.at, st.at + 0.25, to, to + 0.2, T])}
                >
                  <st.Icon size={10} strokeWidth={st.Icon === Check ? 3 : 2} aria-hidden /> {st.text}
                </motion.span>
              );
            })}
          </div>
          <motion.div {...enter(on, T, 4.6)} className="lg-sm w-fit max-w-full rounded-2xl rounded-bl-md px-3 py-1.5">
            Saved ✓ Coffee 25k
          </motion.div>
        </div>
        {/* database side */}
        <div className="lg-sm mt-9 self-start overflow-hidden rounded-xl">
          <div className="flex items-center gap-1 border-b border-line px-2.5 py-1.5 text-ink-3">
            <Database size={11} aria-hidden /> transactions
          </div>
          <div className="flex justify-between px-2.5 py-1 text-ink-3">
            <span>Food</span>
            <span>40.000</span>
          </div>
          <motion.div
            className="flex justify-between border-t border-line px-2.5 py-1 font-medium"
            initial={{ opacity: 0, backgroundColor: "rgba(43,127,255,0)" }}
            animate={on ? { opacity: [0, 0, 1, 1, 0], backgroundColor: ["rgba(43,127,255,0)", "rgba(43,127,255,0)", "rgba(43,127,255,0.18)", "rgba(43,127,255,0)", "rgba(43,127,255,0)"] } : undefined}
            transition={cycle(T, [0, 3.6, 4, 5.5, T])}
          >
            <span>Coffee</span>
            <span>25.000</span>
          </motion.div>
        </div>
      </div>
    );
  },

  /* chats from different apps become tasks on one to-do list */
  "inbox-assistant": ({ on }) => {
    const T = 10;
    const msgs = [
      { app: "whatsapp", task: "Fix empty export" },
      { app: "gmail", task: "Update slides" },
      { app: "slack", task: "Review PR #42" },
    ];
    return (
      <div className="absolute inset-0">
        {msgs.map((m, i) => {
          const go = 0.8 + i * 1.8;
          const y = `${18 + i * 24}%`;
          return (
            <motion.div
              key={m.app}
              className="lg-sm absolute flex size-8 items-center justify-center rounded-xl text-ink"
              initial={{ left: "6%", top: y, opacity: 1 }}
              animate={on ? { left: ["6%", "6%", "52%", "52%", "6%", "6%"], top: [y, y, `${34 + i * 16}%`, `${34 + i * 16}%`, y, y], opacity: [1, 1, 0, 0, 0, 1] } : undefined}
              transition={cycle(T, [0, go, go + 1.1, T - 0.5, T - 0.49, T])}
            >
              <AppLogo app={m.app} size={15} />
            </motion.div>
          );
        })}
        <div className="lg-sm absolute right-[5%] top-[12%] h-[76%] w-[52%] rounded-xl px-2.5 py-2">
          <div className="font-medium">My to-do list</div>
          {msgs.map((m, i) => {
            const land = 0.8 + i * 1.8 + 1.1;
            return (
              <motion.div key={m.app} {...enter(on, T, land, 0)} className="mt-1.5 flex items-center gap-1.5">
                <span className="size-3 shrink-0 rounded border border-line-strong" />
                <span className="flex-1 truncate text-ink-2">{m.task}</span>
                <AppLogo app={m.app} size={10} className="shrink-0 text-ink-3" />
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  },

  /* answering "Yes" reveals a follow-up question, then a location pin drops */
  "outbreak-investigation-platform": ({ on }) => {
    const T = 9;
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-3 px-3">
        <div className="lg-sm w-[56%] rounded-xl px-3 py-2">
          <div className="font-medium">Fever in the last 3 days?</div>
          <div className="mt-1.5 flex gap-1.5">
            <span className="lg-sm relative rounded-full px-2 py-0.5">
              Yes
              <motion.span
                className="lg-accent absolute inset-[-1px] flex items-center justify-center rounded-full"
                initial={{ opacity: 0 }}
                animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
                transition={cycle(T, [0, 1, 1.3, T - 0.6, T])}
              >
                Yes
              </motion.span>
            </span>
            <span className="lg-sm rounded-full px-2 py-0.5">No</span>
          </div>
          <motion.div
            className="overflow-hidden text-ink-2"
            initial={{ height: 0, opacity: 0 }}
            animate={on ? { height: [0, 0, 32, 32, 0], opacity: [0, 0, 1, 1, 0] } : undefined}
            transition={cycle(T, [0, 1.8, 2.4, T - 0.6, T])}
          >
            <div className="mt-2 border-t border-line pt-1.5">↳ Since which day?</div>
          </motion.div>
        </div>
        <div className="lg-sm relative flex size-20 items-center justify-center rounded-xl">
          <span className="absolute inset-3 rounded-full border border-dashed border-line-strong" />
          <motion.span
            className="absolute size-8 rounded-full border border-[var(--human)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={on ? { scale: [0, 0, 0.4, 1.4, 1.4], opacity: [0, 0, 0.8, 0, 0] } : undefined}
            transition={cycle(T, [0, 3.6, 3.8, 4.8, T])}
          />
          <motion.span
            initial={{ y: -30, opacity: 0 }}
            animate={on ? { y: [-30, -30, 0, 0, -30], opacity: [0, 0, 1, 1, 0] } : undefined}
            transition={cycle(T, [0, 3, 3.6, T - 0.6, T])}
          >
            <MapPin size={20} className="text-[var(--human)]" aria-hidden />
          </motion.span>
        </div>
      </div>
    );
  },

  /* a scan passes over the plate, then calories and macros fill in */
  nutriplate: ({ on }) => {
    const T = 9;
    const macros: [string, number][] = [["Protein", 0.55], ["Carbs", 0.8], ["Fat", 0.35]];
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-3 px-3">
        <div className="lg-sm relative flex size-24 items-center justify-center overflow-hidden rounded-full">
          <span className="absolute left-5 top-6 size-7 rounded-full bg-[#f59e0b]/70" />
          <span className="absolute right-5 top-7 size-6 rounded-full bg-[#16a34a]/60" />
          <span className="absolute bottom-5 left-8 h-5 w-9 rounded-full bg-[#f5f5f4] ring-1 ring-black/10" />
          <ScanLine size={44} strokeWidth={1.1} className="relative text-ink/40" aria-hidden />
          <motion.span
            className="lg-accent absolute left-0 right-0 h-0.5"
            initial={{ top: "10%", opacity: 0 }}
            animate={on ? { top: ["10%", "10%", "90%", "90%"], opacity: [0, 1, 1, 0] } : undefined}
            transition={cycle(T, [0, 0.6, 2.4, 2.6], "linear")}
          />
        </div>
        <div className="lg-sm w-[46%] space-y-1.5 rounded-xl px-3 py-2">
          <motion.div {...enter(on, T, 2.6, 0)} className="font-medium">≈ 540 kcal</motion.div>
          {macros.map(([k, v], i) => (
            <div key={k} className="grid grid-cols-[3rem_1fr] items-center gap-2 text-ink-3">
              <span>{k}</span>
              <span className="h-1.5 rounded-full bg-ink/10">
                <motion.span
                  className="block h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={on ? { width: ["0%", "0%", `${v * 100}%`, `${v * 100}%`, "0%"] } : undefined}
                  transition={cycle(T, [0, 3 + i * 0.4, 3.8 + i * 0.4, T - 0.6, T])}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },

  /* each rubric line gets checked, then a grade appears for the teacher to confirm */
  "lab-report-grading-agent": ({ on }) => {
    const T = 10;
    const rubric = ["Theory", "Method", "Conclusion"];
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-2.5 px-3">
        <div className="lg-sm relative w-[30%] space-y-1.5 overflow-hidden rounded-lg px-2.5 py-2.5">
          <div className="h-1.5 w-2/3 rounded-full bg-ink/20" />
          {[90, 75, 85, 60].map((w) => (
            <div key={w} className="h-1.5 rounded-full bg-ink/10" style={{ width: `${w}%` }} />
          ))}
          <motion.span
            className="lg-accent absolute left-1 right-1 h-0.5 rounded-full"
            initial={{ top: "15%", opacity: 0 }}
            animate={on ? { top: ["15%", "15%", "88%", "88%"], opacity: [0, 1, 1, 0] } : undefined}
            transition={cycle(T, [0, 0.5, 4.2, 4.5], "linear")}
          />
        </div>
        <div className="lg-sm w-[38%] rounded-xl px-2.5 py-2">
          {rubric.map((r, i) => {
            const at = 1.2 + i * 1.2;
            const bad = i === 2;
            return (
              <div key={r} className="mt-0.5 flex items-center justify-between">
                <span>{r}</span>
                <motion.span
                  className={`${bad ? "lg-bad" : "lg-ok"} flex size-3.5 items-center justify-center rounded-full`}
                  initial={{ scale: 0 }}
                  animate={on ? { scale: [0, 0, 1, 1, 0] } : undefined}
                  transition={cycle(T, [0, at, at + 0.3, T - 0.6, T])}
                >
                  {bad ? "!" : <Check size={8} strokeWidth={3} />}
                </motion.span>
              </div>
            );
          })}
        </div>
        <motion.div
          className="lg-accent flex size-11 shrink-0 items-center justify-center rounded-full text-[0.9rem] font-medium"
          initial={{ scale: 0 }}
          animate={on ? { scale: [0, 0, 1.15, 1, 1, 0] } : undefined}
          transition={cycle(T, [0, 5, 5.3, 5.5, T - 0.6, T])}
        >
          B+
        </motion.div>
      </div>
    );
  },

  /* an admin edits the heading right on the page, then it saves */
  "rt06-citran-portal": ({ on }) => {
    const T = 10;
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="lg-sm w-[82%] overflow-hidden rounded-xl">
          <div className="flex items-center gap-1 border-b border-line px-2.5 py-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 rounded-full bg-ink/20" />
            ))}
            <span className="ml-2 h-1.5 w-24 rounded-full bg-ink/10" />
          </div>
          <div className="relative px-3 py-2.5">
            <div className="flex items-center text-[0.85rem] font-medium">
              <span className="relative inline-block">
                <motion.span
                  className="block overflow-hidden whitespace-nowrap"
                  initial={{ width: "11ch" }}
                  animate={on ? { width: ["11ch", "11ch", "0ch", "0ch", "11ch"] } : undefined}
                  transition={cycle(T, [0, 1.5, 2.6, T - 0.4, T], "linear")}
                >
                  Village news
                </motion.span>
              </span>
              <motion.span
                className="block overflow-hidden whitespace-nowrap"
                initial={{ width: "0ch" }}
                animate={on ? { width: ["0ch", "0ch", "17ch", "17ch", "0ch"] } : undefined}
                transition={cycle(T, [0, 2.8, 5, T - 0.4, T], "linear")}
              >
                Kotagede heritage
              </motion.span>
              <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-accent" />
            </div>
            <div className="mt-1.5 h-1.5 w-11/12 rounded-full bg-ink/10" />
            <div className="mt-1 h-1.5 w-3/4 rounded-full bg-ink/10" />
            <span className="absolute right-2.5 top-2">
              <motion.span
                className="lg-accent flex items-center gap-1 rounded-full px-2 py-0.5"
                animate={on ? { opacity: [1, 1, 0, 0, 1] } : undefined}
                transition={cycle(T, [0, 5.4, 5.6, T - 0.4, T])}
              >
                <Pencil size={10} aria-hidden /> Editing
              </motion.span>
              <motion.span
                className="lg-ok absolute right-0 top-0 flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5"
                initial={{ opacity: 0 }}
                animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
                transition={cycle(T, [0, 5.5, 5.8, T - 0.6, T - 0.4])}
              >
                <Check size={10} strokeWidth={3} /> Saved
              </motion.span>
            </span>
          </div>
        </div>
      </div>
    );
  },
};

function Generic() {
  return <div className="lg-sm absolute inset-x-[15%] inset-y-[25%] rounded-xl" />;
}
