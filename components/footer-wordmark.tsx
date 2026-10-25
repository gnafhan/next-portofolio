"use client";

import { useId, useRef } from "react";

const TEXT_STYLE = { fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 600, fontSize: 330, letterSpacing: "-0.04em" } as const;

/**
 * Giant halftone "nafhan". Blue dots twinkle inside the letters, a slow scan band sweeps across,
 * and the dots under the cursor light up. Every layer is a dot pattern clipped to the text.
 */
export function FooterWordmark() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const spotRef = useRef<SVGCircleElement>(null);
  const id = (name: string) => `${name}-${uid}`;

  const move = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    const spot = spotRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !spot || !ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    spot.setAttribute("cx", String(p.x));
    spot.setAttribute("cy", String(p.y));
    spot.setAttribute("r", "95");
  };
  const leave = () => spotRef.current?.setAttribute("r", "0");

  const word = (fill: string) => (
    <text x="500" y="250" textAnchor="middle" fill={fill} style={TEXT_STYLE}>
      nafhan
    </text>
  );

  return (
    <div className="relative mt-6 select-none" style={{ height: "max(21.3vw, 122px)" }} onPointerMove={move} onPointerLeave={leave} aria-hidden>
      <svg ref={svgRef} viewBox="0 0 1000 270" className="absolute left-1/2 top-0 w-[112%] min-w-[640px] -translate-x-1/2">
        <defs>
          <pattern id={id("base")} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="2.1" className="fill-[var(--ink)]" />
          </pattern>
          {/* sparse accent dots on the same grid, three offsets */}
          {[
            [3.5, 3.5],
            [17.5, 10.5],
            [10.5, 17.5],
          ].map(([x, y], k) => (
            <pattern key={k} id={id(`tw${k}`)} width="21" height="21" patternUnits="userSpaceOnUse">
              <circle cx={x} cy={y} r="2.5" className="fill-[var(--accent)]" />
            </pattern>
          ))}
          <pattern id={id("hot")} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="2.6" className="fill-[var(--accent)]" />
          </pattern>
          <clipPath id={id("word")}>{word("#000")}</clipPath>
          <clipPath id={id("spot")}>
            <circle ref={spotRef} cx="-200" cy="-200" r="0" style={{ transition: "r 0.3s ease" }} />
          </clipPath>
        </defs>

        {word(`url(#${id("base")})`)}

        <g clipPath={`url(#${id("word")})`}>
          <rect width="1000" height="270" fill={`url(#${id("tw0")})`} className="wordmark-twinkle" style={{ animationDuration: "2.6s" }} />
          <rect width="1000" height="270" fill={`url(#${id("tw1")})`} className="wordmark-twinkle" style={{ animationDuration: "3.4s", animationDelay: "-1.1s" }} />
          <rect width="1000" height="270" fill={`url(#${id("tw2")})`} className="wordmark-twinkle" style={{ animationDuration: "4.1s", animationDelay: "-2.3s" }} />
          <rect x="-160" width="120" height="270" fill={`url(#${id("hot")})`} className="wordmark-scan" />
          <g clipPath={`url(#${id("spot")})`}>
            <rect width="1000" height="270" fill={`url(#${id("hot")})`} />
          </g>
        </g>
      </svg>
    </div>
  );
}
