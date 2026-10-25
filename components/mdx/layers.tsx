"use client";

import * as m from "motion/react-m";
import { useStart } from "../anim";

type Layer = { label: string; holes?: number[] };
type Item = { label?: string; at: number; blockedBy?: number };

const PX = 40; // left edge of a plane
const WP = 290; // plane width
const SKEW = 36; // how far the back edge leans right
const D = 24; // plane depth on screen
const GAP = 50; // vertical distance between planes
const TOP = 64; // y of the first plane

const colX = (c: number) => PX + SKEW / 2 + 22 + c * (WP - 44);
const planeY = (i: number) => TOP + i * GAP;
const midY = (i: number) => planeY(i) + D / 2;

/**
 * Isometric "layers of checks" illustration: things fall from the top, pass through holes,
 * and stop at the first layer that has no hole for them. Items without `blockedBy` reach `bottom`.
 *
 * <Layers
 *   top="requests in"
 *   bottom="reaches my board"
 *   layers={[{ label: "only listed chats are read" }, { label: "write tools denied" }]}
 *   items={[{ at: 0.15, label: "unlisted chat", blockedBy: 0 }, { at: 0.5 }]}
 * />
 */
export function Layers({ layers, items, top, bottom }: { layers: Layer[]; items: Item[]; top?: string; bottom?: string }) {
  const [ref, on] = useStart(0.3);
  const n = layers.length;
  const height = midY(n - 1) + (bottom ? 70 : 30);
  const T = 2.2 + items.length * 1.1 + 2.5;

  const holesFor = (i: number) => {
    const passing = items.filter((it) => it.blockedBy === undefined || it.blockedBy > i).map((it) => it.at);
    return [...new Set([...passing, ...(layers[i].holes ?? [])])];
  };

  return (
    <div ref={ref} className="not-prose w-full overflow-x-auto">
      <svg viewBox={`0 0 640 ${height}`} className="h-auto w-full min-w-[520px]" role="img" aria-label="Layers of checks">
        {top && (
          <text x={PX + 6} y={26} className="fill-[var(--ink-3)] text-[13px]">
            {top}
          </text>
        )}

        {/* dashed trails (drawn under the planes) */}
        {items.map((it, k) => {
          const stop = it.blockedBy === undefined ? (bottom ? midY(n - 1) + 46 : midY(n - 1)) : midY(it.blockedBy);
          const pass = it.blockedBy === undefined;
          return (
            <line
              key={k}
              x1={colX(it.at)}
              x2={colX(it.at)}
              y1={52}
              y2={stop}
              strokeDasharray="3 4"
              className={pass ? "stroke-[var(--accent)]" : "stroke-[var(--ink-3)]"}
              strokeWidth={1}
              opacity={pass ? 0.9 : 0.55}
            />
          );
        })}

        {/* planes with holes */}
        {layers.map((l, i) => {
          const y = planeY(i);
          const pts = `${PX + SKEW},${y} ${PX + SKEW + WP},${y} ${PX + WP},${y + D} ${PX},${y + D}`;
          return (
            <g key={l.label}>
              <polygon points={pts} className="fill-[var(--surface-2)] stroke-[var(--line-strong)]" strokeWidth={1} opacity={0.96} />
              {holesFor(i).map((c) => (
                <ellipse key={c} cx={colX(c)} cy={midY(i)} rx={13} ry={4.5} className="fill-[var(--bg)] stroke-[var(--line-strong)]" />
              ))}
              <text x={PX + WP + SKEW + 26} y={midY(i) + 4} className="fill-[var(--ink)] text-[13px]">
                {l.label}
              </text>
            </g>
          );
        })}

        {bottom && (
          <>
            <path
              d={`M ${colX(0.5) - 46} ${midY(n - 1) + 36} Q ${colX(0.5)} ${midY(n - 1) + 62} ${colX(0.5) + 46} ${midY(n - 1) + 36}`}
              className="fill-none stroke-[var(--accent)]"
              strokeWidth={1}
            />
            <text x={PX + WP + SKEW + 26} y={midY(n - 1) + 50} className="fill-[var(--accent)] text-[13px]">
              {bottom}
            </text>
          </>
        )}

        {/* falling dots */}
        {items.map((it, k) => {
          const pass = it.blockedBy === undefined;
          const stop = pass ? (bottom ? midY(n - 1) + 46 : midY(n - 1)) : midY(it.blockedBy!) - 1;
          const start = 1 + k * 1.1;
          const fall = Math.max(0.8, ((stop - 52) / GAP) * 0.35);
          const t = (s: number) => Math.min(1, s / T);
          return (
            <m.circle
              key={k}
              cx={colX(it.at)}
              r={5}
              className={pass ? "fill-[var(--accent)]" : "fill-[var(--human)]"}
              stroke="var(--bg)"
              strokeWidth={1.5}
              initial={{ cy: stop, opacity: 1 }}
              animate={on ? { cy: [52, 52, stop, stop, stop], opacity: [0, 1, 1, 1, 0] } : undefined}
              transition={{
                duration: T,
                times: [0, t(start), t(start + fall), t(T - 0.5), 1],
                repeat: Infinity,
                ease: ["linear", "easeIn", "linear", "linear"],
              }}
            />
          );
        })}
        {/* labels sit next to where each item ends up */}
        {items.map((it, k) => {
          if (!it.label) return null;
          const pass = it.blockedBy === undefined;
          const y = pass ? (bottom ? midY(n - 1) + 46 : midY(n - 1)) : midY(it.blockedBy!);
          return (
            <m.text
              key={`l${k}`}
              x={colX(it.at) + 10}
              y={y - 9}
              className={`text-[10.5px] ${pass ? "fill-[var(--accent)]" : "fill-[var(--human)]"}`}
              initial={{ opacity: 0 }}
              animate={on ? { opacity: [0, 0, 1, 1, 0] } : undefined}
              transition={{
                duration: T,
                times: [0, Math.min(1, (1 + k * 1.1 + 0.8) / T), Math.min(1, (1 + k * 1.1 + 1.1) / T), Math.min(1, (T - 0.5) / T), 1],
                repeat: Infinity,
              }}
            >
              {it.label}
            </m.text>
          );
        })}
      </svg>
    </div>
  );
}
