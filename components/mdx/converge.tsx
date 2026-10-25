"use client";

import { useId } from "react";
import { useStart } from "../anim";

/** An isometric tile: a flat parallelogram with a label on it. */
function Tile({ x, y, w, label, accent = false }: { x: number; y: number; w: number; label: string; accent?: boolean }) {
  const skew = 14;
  const d = 30;
  const pts = `${x + skew},${y} ${x + skew + w},${y} ${x + w},${y + d} ${x},${y + d}`;
  return (
    <g>
      <polygon points={pts} transform="translate(0,4)" className="fill-[var(--line)]" />
      <polygon
        points={pts}
        className={accent ? "fill-[var(--accent)] stroke-[var(--accent)]" : "fill-[var(--surface-2)] stroke-[var(--line-strong)]"}
        strokeWidth={1}
      />
      <text
        x={x + skew / 2 + w / 2}
        y={y + d / 2 + 4}
        textAnchor="middle"
        className={accent ? "fill-white text-[12px] font-medium" : "fill-[var(--ink)] text-[12px]"}
      >
        {label}
      </text>
    </g>
  );
}

/**
 * Many sources flow into one hub, which feeds one or more outputs. Dots travel along the paths.
 *
 * <Converge
 *   sources={["Work chats", "Campus chats", "Side projects", "Coding sessions"]}
 *   hub="AI assistant"
 *   hubNote="read-only"
 *   outputs={["Proposed tickets", "Standup draft"]}
 *   gate="I approve"
 * />
 */
export function Converge({
  sources,
  hub,
  hubNote,
  outputs,
  gate,
}: {
  sources: string[];
  hub: string;
  hubNote?: string;
  outputs: string[];
  gate?: string;
}) {
  const [ref, on] = useStart(0.3);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rowH = 52;
  const height = Math.max(sources.length, outputs.length) * rowH + 40;
  const hubX = 300;
  const hubY = height / 2;
  const srcY = (i: number) => 20 + i * rowH + (height - 40 - sources.length * rowH) / 2;
  const outY = (i: number) => 20 + i * rowH + (height - 40 - outputs.length * rowH) / 2 + 6;
  const inPath = (i: number) => {
    const y = srcY(i) + 15;
    return `M 172 ${y} C 230 ${y}, 236 ${hubY}, ${hubX - 46} ${hubY}`;
  };
  const outPath = (i: number) => {
    const y = outY(i) + 15;
    return `M ${hubX + 46} ${hubY} C 380 ${hubY}, 380 ${y}, 440 ${y}`;
  };

  return (
    <div ref={ref} className="not-prose w-full overflow-x-auto">
      <svg viewBox={`0 0 640 ${height}`} className="h-auto w-full min-w-[520px]" role="img" aria-label={`${sources.join(", ")} flow into ${hub}`}>
        {sources.map((_, i) => (
          <path key={`in${i}`} id={`cv-in-${i}-${uid}`} d={inPath(i)} className="fill-none stroke-[var(--ink-3)]" strokeWidth={1} strokeDasharray="3 4" opacity={0.6} />
        ))}
        {outputs.map((_, i) => (
          <path key={`out${i}`} id={`cv-out-${i}-${uid}`} d={outPath(i)} className="fill-none stroke-[var(--accent)]" strokeWidth={1} strokeDasharray="3 4" />
        ))}

        {sources.map((s, i) => (
          <Tile key={s} x={20} y={srcY(i)} w={150} label={s} />
        ))}

        {/* hub: a raised diamond */}
        <g>
          <polygon points={`${hubX},${hubY - 34} ${hubX + 46},${hubY} ${hubX},${hubY + 34} ${hubX - 46},${hubY}`} transform="translate(0,5)" className="fill-[var(--line)]" />
          <polygon
            points={`${hubX},${hubY - 34} ${hubX + 46},${hubY} ${hubX},${hubY + 34} ${hubX - 46},${hubY}`}
            className="fill-[var(--surface)] stroke-[var(--accent)]"
            strokeWidth={1.2}
          />
          <text x={hubX} y={hubY + (hubNote ? -1 : 4)} textAnchor="middle" className="fill-[var(--ink)] text-[11.5px] font-medium">
            {hub}
          </text>
          {hubNote && (
            <text x={hubX} y={hubY + 13} textAnchor="middle" className="fill-[var(--ink-3)] text-[10px]">
              {hubNote}
            </text>
          )}
        </g>

        {gate && (
          <g>
            <line x1={410} x2={410} y1={20} y2={height - 20} className="stroke-[var(--human)]" strokeWidth={1} strokeDasharray="2 3" />
            <text x={410} y={14} textAnchor="middle" className="fill-[var(--human)] text-[11px]">
              {gate}
            </text>
          </g>
        )}

        {outputs.map((o, i) => (
          <Tile key={o} x={440} y={outY(i)} w={160} label={o} accent={i === 0} />
        ))}

        {/* travelling dots */}
        {on &&
          sources.map((_, i) => (
            <circle key={`d-in${i}`} r={4} opacity={0} className="fill-[var(--ink-2)]">
              <set attributeName="opacity" to="1" begin={`${i * 0.8}s`} />
              <animateMotion dur="3.2s" begin={`${i * 0.8}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
                <mpath href={`#cv-in-${i}-${uid}`} />
              </animateMotion>
            </circle>
          ))}
        {on &&
          outputs.map((_, i) => (
            <circle key={`d-out${i}`} r={4} opacity={0} className="fill-[var(--accent)]">
              <set attributeName="opacity" to="1" begin={`${1.6 + i * 0.9}s`} />
              <animateMotion dur="2.6s" begin={`${1.6 + i * 0.9}s`} repeatCount="indefinite" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.4 0 0.2 1">
                <mpath href={`#cv-out-${i}-${uid}`} />
              </animateMotion>
            </circle>
          ))}
      </svg>
    </div>
  );
}
