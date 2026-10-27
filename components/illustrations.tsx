"use client";

import * as m from "motion/react-m";
import { Award, BrainCircuit, Database, GraduationCap, LayoutDashboard, Medal, Server, Trophy } from "lucide-react";
import { SiGoogle, SiMeta } from "react-icons/si";
import { cycle, useStart } from "./anim";

/* Data → backend → AI → UI, with a request travelling through each layer. */
const LAYERS = [
  { label: "Data", note: "pipelines, Postgres", Icon: Database },
  { label: "Backend", note: "APIs, auth, queues", Icon: Server },
  { label: "AI", note: "LLMs, tools, evals", Icon: BrainCircuit },
  { label: "UI", note: "what people touch", Icon: LayoutDashboard },
];

export function StackFlow() {
  const [ref, on] = useStart();
  const T = 8;
  return (
    <div ref={ref} className="glass relative overflow-hidden rounded-3xl px-5 py-7">
      <div className="relative grid grid-cols-4 gap-3">
        <span className="absolute left-[12%] right-[12%] top-6 h-px bg-line-strong" aria-hidden />
        {LAYERS.map(({ label, note, Icon }, i) => (
          <div key={label} className="relative flex flex-col items-center text-center">
            <m.span
              className="lg-sm relative z-10 flex size-12 items-center justify-center rounded-2xl text-ink"
              animate={on ? { scale: [1, 1, 1.15, 1, 1] } : undefined}
              transition={cycle(T, [0, 0.6 + i * 1.6, 0.9 + i * 1.6, 1.3 + i * 1.6, T])}
            >
              <Icon size={20} aria-hidden />
            </m.span>
            <span className="mt-2 text-[0.9rem] font-medium">{label}</span>
            <span className="text-[0.75rem] text-ink-3">{note}</span>
          </div>
        ))}
        <m.span
          className="lg-accent absolute top-[18px] z-20 size-3 rounded-full"
          initial={{ left: "12%", opacity: 0 }}
          animate={on ? { left: ["12%", "12%", "37%", "62.5%", "87%", "87%"], opacity: [0, 1, 1, 1, 1, 0] } : undefined}
          transition={cycle(T, [0, 0.6, 2.2, 3.8, 5.4, 6], "linear")}
        />
      </div>
      <p className="mt-6 text-center text-[0.85rem] text-ink-3">One person, the whole path: from where the data lives to the screen people use.</p>
    </div>
  );
}

/* Experience as a timeline that draws itself */
export function Timeline({ items }: { items: readonly { org: string; role: string; period: string }[] }) {
  const [ref, on] = useStart(0.15);
  return (
    <div ref={ref} className="relative pl-7">
      <m.span
        className="absolute left-[9px] top-2 w-px origin-top bg-line-strong"
        style={{ bottom: 8 }}
        initial={{ scaleY: 0 }}
        animate={on ? { scaleY: 1 } : undefined}
        transition={{ duration: 1.6, ease: "easeOut" }}
      />
      <ul className="space-y-3">
        {items.map((e, i) => (
          <m.li
            key={`${e.org}-${e.role}`}
            className="relative"
            initial={{ opacity: 0, x: -8 }}
            animate={on ? { opacity: 1, x: 0 } : undefined}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
          >
            <span className={`absolute -left-[25px] top-4 size-3 rounded-full ${i < 3 ? "lg-accent" : "lg-sm"}`} />
            <div className="glass grid gap-1 rounded-2xl px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
              <div>
                <span className="font-medium">{e.org}</span>
                <span className="text-ink-2"> · {e.role}</span>
              </div>
              <span className="text-[0.88rem] text-ink-3">{e.period}</span>
            </div>
          </m.li>
        ))}
      </ul>
    </div>
  );
}

/* Awards and certificates as glass badges */

export function CredentialGrid({
  honors,
  certifications,
}: {
  honors: readonly { title: string; year: string }[];
  certifications: readonly { title: string; issuer: string; year: string }[];
}) {
  const [ref, on] = useStart(0.2);
  const honorIcon = (t: string) => (/1st|place/i.test(t) ? Trophy : /scholarship/i.test(t) ? GraduationCap : /mention/i.test(t) ? Medal : Award);
  const certIcon = (issuer: string) => (issuer === "Google" ? SiGoogle : SiMeta);
  return (
    <div ref={ref} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {honors.map((h, i) => {
        const Icon = honorIcon(h.title);
        return (
          <m.div
            key={h.title}
            className="glass flex items-start gap-3 rounded-2xl px-4 py-3"
            initial={{ opacity: 0, y: 10 }}
            animate={on ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: i * 0.08, duration: 0.45 }}
          >
            <span className="lg-sm flex size-9 shrink-0 items-center justify-center rounded-xl text-ink">
              <Icon size={17} aria-hidden />
            </span>
            <div>
              <div className="text-[0.92rem] leading-snug">{h.title}</div>
              <div className="mt-0.5 text-[0.8rem] text-ink-3">{h.year}</div>
            </div>
          </m.div>
        );
      })}
      {certifications.map((c, i) => {
        const Icon = certIcon(c.issuer);
        return (
          <m.div
            key={c.title}
            className="glass flex items-start gap-3 rounded-2xl px-4 py-3"
            initial={{ opacity: 0, y: 10 }}
            animate={on ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: (honors.length + i) * 0.08, duration: 0.45 }}
          >
            <span className="lg-sm flex size-9 shrink-0 items-center justify-center rounded-xl text-ink">
              <Icon size={15} aria-hidden />
            </span>
            <div>
              <div className="text-[0.92rem] leading-snug">{c.title}</div>
              <div className="mt-0.5 text-[0.8rem] text-ink-3">
                {c.issuer} · {c.year}
              </div>
            </div>
          </m.div>
        );
      })}
    </div>
  );
}
