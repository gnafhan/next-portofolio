"use client";

import { useInView } from "motion/react";
import { useRef } from "react";

/**
 * Starts once the element is first seen, then keeps looping. Scrolling away and back
 * does not restart it, so viewers never lose their place in the story.
 */
export function useStart(amount = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const started = useInView(ref, { amount, once: true });
  return [ref, started] as const;
}

/** Looping keyframe transition. `at` are absolute seconds within a cycle of `total` seconds. */
export function cycle(total: number, at: number[], ease: "easeInOut" | "linear" = "easeInOut") {
  return { duration: total, times: at.map((t) => Math.min(1, Math.max(0, t / total))), repeat: Infinity, ease };
}
