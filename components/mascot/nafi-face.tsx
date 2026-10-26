"use client";

import * as m from "motion/react-m";
import type { MotionValue } from "motion/react";
import { Logo } from "../icons";

export type Mood = "idle" | "happy" | "wave" | "sleep" | "dizzy" | "talk" | "point" | "hover";

/**
 * Nafi: a little liquid-glass drop (the same drops the intro melts into the N) with big eyes,
 * blush and an N-shaped tuft. Pure SVG + one lit-glass div, no images.
 */
export function NafiFace({
  mood,
  blink,
  px,
  py,
  pointLeft,
}: {
  mood: Mood;
  blink: boolean;
  px: MotionValue<number>;
  py: MotionValue<number>;
  pointLeft: boolean;
}) {
  const closed = mood === "sleep" || mood === "happy" || mood === "wave";
  return (
    <div className="relative size-[76px]">
      {/* tuft */}
      <div className="absolute left-1/2 top-[-2px] -translate-x-1/2 -rotate-[10deg]">
        <Logo size={20} />
      </div>

      {/* arms */}
      <m.span
        className="nafi-arm absolute left-[2px] top-[44px] h-[12px] w-[16px] origin-right rounded-full"
        animate={mood === "point" && pointLeft ? { rotate: -10, x: -6 } : { rotate: 18, x: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      />
      <m.span
        className="nafi-arm absolute right-[2px] top-[44px] h-[12px] w-[16px] origin-left rounded-full"
        animate={
          mood === "wave"
            ? { rotate: [-30, -70, -30, -70, -30], x: 0 }
            : mood === "point" && !pointLeft
              ? { rotate: 10, x: 6 }
              : { rotate: -18, x: 0 }
        }
        transition={mood === "wave" ? { duration: 1.4, ease: "easeInOut" } : { type: "spring", stiffness: 260, damping: 16 }}
      />

      {/* body */}
      <div className="nafi-body absolute left-[10px] top-[14px] h-[58px] w-[56px]">
        <svg viewBox="0 0 56 58" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          {/* blush */}
          <ellipse cx="12" cy="36" rx="5" ry="3" fill="#ff8fab" opacity={mood === "sleep" ? 0.35 : 0.6} />
          <ellipse cx="44" cy="36" rx="5" ry="3" fill="#ff8fab" opacity={mood === "sleep" ? 0.35 : 0.6} />

          {/* eyes */}
          {mood === "dizzy" ? (
            <g stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round">
              <path d="M14 22 q4 -4 6 0 q2 5 -3 5 q-4 0 -2 -4" />
              <path d="M36 22 q4 -4 6 0 q2 5 -3 5 q-4 0 -2 -4" />
            </g>
          ) : closed ? (
            <g stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round">
              {mood === "sleep" ? (
                <>
                  <path d="M13 26 q4 3 8 0" />
                  <path d="M35 26 q4 3 8 0" />
                </>
              ) : (
                <>
                  <path d="M13 27 q4 -5 8 0" />
                  <path d="M35 27 q4 -5 8 0" />
                </>
              )}
            </g>
          ) : (
            <m.g style={{ x: px, y: py }}>
              <g style={{ transform: blink ? "scaleY(0.12)" : "scaleY(1)", transformOrigin: "28px 25px", transition: "transform 90ms" }}>
                <ellipse cx="17" cy="25" rx={mood === "hover" ? 5 : 4.4} ry={mood === "hover" ? 6.2 : 5.6} fill="#0f172a" />
                <ellipse cx="39" cy="25" rx={mood === "hover" ? 5 : 4.4} ry={mood === "hover" ? 6.2 : 5.6} fill="#0f172a" />
                <circle cx="18.6" cy="22.6" r="1.6" fill="#fff" />
                <circle cx="40.6" cy="22.6" r="1.6" fill="#fff" />
              </g>
            </m.g>
          )}

          {/* mouth */}
          {mood === "talk" ? (
            <m.ellipse cx="28" cy="38" rx="3.4" fill="#0f172a" animate={{ ry: [1.2, 3, 1.4, 2.6, 1.2] }} transition={{ duration: 0.9, repeat: Infinity }} />
          ) : mood === "happy" || mood === "wave" ? (
            <path d="M22 35 q6 7 12 0 z" fill="#0f172a" />
          ) : mood === "sleep" ? (
            <circle cx="28" cy="38" r="1.6" fill="#0f172a" />
          ) : mood === "dizzy" ? (
            <path d="M22 38 q2 -2 4 0 q2 2 4 0 q2 -2 4 0" stroke="#0f172a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M23.5 36 q4.5 4 9 0" stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          )}
        </svg>
      </div>

      {/* sleep z's */}
      {mood === "sleep" && (
        <m.span
          className="absolute -right-1 top-0 text-[11px] font-semibold text-ink-3"
          animate={{ opacity: [0, 1, 0], y: [4, -8, -16] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          z
        </m.span>
      )}
    </div>
  );
}
