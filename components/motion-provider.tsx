"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Animation features load after first paint instead of shipping with every page, and
 * transform/layout animations are skipped for visitors who ask for reduced motion.
 * `strict` makes the build fail if a full `motion.*` component sneaks back in: use `m.*`.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
