"use client";

import { motion } from "motion/react";
import { useStart } from "../anim";

type Stage = { label: string; note?: string; token: string; human?: boolean };

const W = 96; // block width
const SK = 16; // depth skew
const H = 22; // front face height
const Y0 = 82; // top-front edge of every block

/**
 * Isometric blocks in a row. A token travels across them and its text changes at every stage,
 * so the reader sees what each step does to the data.
 *
 * <Pipeline stages={[
 *   { label: "WhatsApp", note: "user types", token: "coffee & bread 40k" },
 *   { label: "Model", note: "reads intent", token: "2 expenses" },
 *   { label: "Ledger code", note: "does the math", token: "Coffee 25k · Bread 15k" },
 *   { label: "Database", token: "saved ✓" },
 * ]} />
 */
export function Pipeline({ stages }: { stages: Stage[] }) {
  const [ref, on] = useStart(0.3);
  const n = stages.length;
  const span = 640 - 80 - W - SK;
  const x0 = (i: number) => 40 + (n === 1 ? span / 2 : (i * span) / (n - 1));
  const cx = (i: number) => x0(i) + (W + SK) / 2;
  const DWELL = 1.7;
  const MOVE = 0.9;
  const T = n * (DWELL + MOVE) + 0.8;
  const arrive = (i: number) => 0.4 + i * (DWELL + MOVE);
  const longest = Math.max(...stages.map((s) => s.token.length));
  const pillW = Math.min(150, Math.max(70, longest * 6.4 + 22));
  const tokenY = Y0 - SK * 0.6 - 30;

  const xs: number[] = [];
  const times: number[] = [];
  stages.forEach((_, i) => {
    const a = arrive(i);
    if (i === 0) {
      xs.push(cx(0), cx(0));
      times.push(0, a);
    } else {
      xs.push(cx(i));
      times.push(a);
    }
    xs.push(cx(i));
    times.push(Math.min(a + DWELL, T - 0.4));
  });
  xs.push(cx(n - 1), cx(0));
  times.push(T - 0.01, T);

  return (
    <div ref={ref} className="not-prose w-full overflow-x-auto">
      <svg viewBox="0 0 640 168" className="h-auto w-full min-w-[520px]" role="img" aria-label={stages.map((s) => s.label).join(" → ")}>
        {/* connectors */}
        {stages.slice(0, -1).map((_, i) => (
          <path
            key={`c${i}`}
            d={`M ${cx(i)} ${Y0 - 14} Q ${(cx(i) + cx(i + 1)) / 2} ${Y0 - 44} ${cx(i + 1)} ${Y0 - 14}`}
            className="fill-none stroke-[var(--ink-3)]"
            strokeWidth={1}
            strokeDasharray="3 4"
            opacity={0.7}
          />
        ))}

        {/* blocks */}
        {stages.map((s, i) => {
          const x = x0(i);
          const back = Y0 - SK * 0.6;
          const top = `${x},${Y0} ${x + W},${Y0} ${x + W + SK},${back} ${x + SK},${back}`;
          const front = `${x},${Y0} ${x + W},${Y0} ${x + W},${Y0 + H} ${x},${Y0 + H}`;
          const side = `${x + W},${Y0} ${x + W + SK},${back} ${x + W + SK},${back + H} ${x + W},${Y0 + H}`;
          const edge = s.human ? "stroke-[var(--human)]" : "stroke-[var(--line-strong)]";
          return (
            <g key={s.label}>
              <polygon points={front} className={`fill-[var(--line)] ${edge}`} strokeWidth={1} />
              <polygon points={side} className={`fill-[var(--line-strong)] ${edge}`} strokeWidth={1} opacity={0.8} />
              <polygon points={top} className={`fill-[var(--surface-2)] ${edge}`} strokeWidth={1} />
              <motion.polygon
                points={top}
                className={s.human ? "fill-[var(--human)]" : "fill-[var(--accent)]"}
                initial={{ opacity: 0 }}
                animate={on ? { opacity: [0, 0, 0.35, 0.35, 0, 0] } : undefined}
                transition={{
                  duration: T,
                  times: [0, arrive(i) / T, (arrive(i) + 0.2) / T, Math.min(arrive(i) + DWELL, T - 0.5) / T, Math.min(arrive(i) + DWELL + 0.2, T - 0.3) / T, 1],
                  repeat: Infinity,
                }}
              />
              <text x={x + W / 2} y={Y0 + H + 22} textAnchor="middle" className={`text-[12.5px] font-medium ${s.human ? "fill-[var(--human)]" : "fill-[var(--ink)]"}`}>
                {s.label}
              </text>
              {s.note && (
                <text x={x + W / 2} y={Y0 + H + 38} textAnchor="middle" className="fill-[var(--ink-3)] text-[10.5px]">
                  {s.note}
                </text>
              )}
            </g>
          );
        })}

        {/* the travelling token */}
        <motion.g
          initial={{ x: cx(0) }}
          animate={on ? { x: xs } : undefined}
          transition={{ duration: T, times: times.map((t) => t / T), repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x={-pillW / 2} y={tokenY} width={pillW} height={22} rx={11} className="fill-[var(--accent)]" opacity={0.92} />
          <rect x={-pillW / 2 + 0.5} y={tokenY + 0.5} width={pillW - 1} height={10} rx={10} className="fill-white" opacity={0.18} />
          {stages.map((s, i) => {
            const a = arrive(i) - (i === 0 ? 0.4 : MOVE * 0.5);
            const b = i + 1 < n ? arrive(i + 1) - MOVE * 0.5 : T - 0.3;
            return (
              <motion.text
                key={s.token}
                x={0}
                y={tokenY + 15}
                textAnchor="middle"
                className="fill-white text-[11px] font-medium"
                initial={{ opacity: i === 0 ? 1 : 0 }}
                animate={on ? { opacity: i === 0 ? [1, 1, 0, 0, 1] : [0, 0, 1, 1, 0, 0] } : undefined}
                transition={{
                  duration: T,
                  times: i === 0 ? [0, b / T, (b + 0.15) / T, (T - 0.2) / T, 1] : [0, a / T, (a + 0.15) / T, b / T, Math.min(b + 0.15, T) / T, 1],
                  repeat: Infinity,
                }}
              >
                {s.token}
              </motion.text>
            );
          })}
        </motion.g>
      </svg>
    </div>
  );
}
