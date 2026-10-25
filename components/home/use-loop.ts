"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Steps through 0..steps-1 while the element is on screen, waiting `delays[i]` ms
 * after each step, then starts over. Returns [ref, step].
 */
export function useLoop(delays: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % delays.length), delays[step]);
    return () => clearTimeout(t);
  }, [inView, step, delays]);

  return [ref, inView ? step : 0] as const;
}
