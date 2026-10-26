"use client";

import { useEffect } from "react";
import * as m from "motion/react-m";
import { animate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import type { IconType } from "react-icons";
import {
  SiApacheairflow,
  SiClaude,
  SiDocker,
  SiFastapi,
  SiGooglecloud,
  SiGooglegemini,
  SiHuggingface,
  SiKubernetes,
  SiLanggraph,
  SiPytorch,
  SiTerraform,
} from "react-icons/si";

// final offsets from the portrait's head (px at the 380px desktop size), clear of the two glass cards
const TOOLS: { name: string; Icon: IconType; color: string; x: number; y: number; r: number }[] = [
  { name: "LangGraph", Icon: SiLanggraph, color: "var(--ink)", x: -235, y: -60, r: -16 },
  { name: "Claude", Icon: SiClaude, color: "#D97757", x: -175, y: -165, r: 12 },
  { name: "Gemini", Icon: SiGooglegemini, color: "#8E75B2", x: -75, y: -220, r: -10 },
  { name: "Hugging Face", Icon: SiHuggingface, color: "#FFB000", x: 40, y: -232, r: 14 },
  { name: "PyTorch", Icon: SiPytorch, color: "#EE4C2C", x: -250, y: 50, r: 18 },
  { name: "Terraform", Icon: SiTerraform, color: "#844FBA", x: 235, y: -85, r: -14 },
  { name: "Kubernetes", Icon: SiKubernetes, color: "#326CE5", x: 255, y: 25, r: 16 },
  { name: "Google Cloud", Icon: SiGooglecloud, color: "#4285F4", x: 160, y: -200, r: -8 },
  { name: "Airflow", Icon: SiApacheairflow, color: "#017CEE", x: -215, y: 150, r: -18 },
  { name: "Docker", Icon: SiDocker, color: "#2496ED", x: -135, y: 230, r: 10 },
  { name: "FastAPI", Icon: SiFastapi, color: "#009688", x: 210, y: 228, r: -12 },
];

/**
 * Tool icons tucked behind the portrait. They peek out on load, then bloom outwards (spreading,
 * growing and tilting a little) as the visitor scrolls down.
 */
export function ToolBloom() {
  const calm = useReducedMotion();
  const enter = useMotionValue(calm ? 1 : 0);
  const { scrollY } = useScroll();
  const scrolled = useTransform(scrollY, [0, 260], [0, 1], { clamp: true });
  const bloom = useTransform<number, number>([enter, scrolled], ([a, b]) => (calm ? 1 : a * 0.5 + b * 0.5));
  const p = useSpring(bloom, { stiffness: 90, damping: 18, mass: 0.7 });

  useEffect(() => {
    if (calm) return;
    const c = animate(enter, 1, { duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [calm, enter]);

  return (
    <ul className="pointer-events-none absolute left-1/2 top-[40%] z-0 scale-[0.79] sm:scale-100" aria-label="Tools I build with">
      {TOOLS.map((t, i) => (
        <Tool key={t.name} tool={t} i={i} p={p} />
      ))}
    </ul>
  );
}

function Tool({ tool, i, p }: { tool: (typeof TOOLS)[number]; i: number; p: MotionValue<number> }) {
  // each icon leaves a little later than the one before, so the bloom unfolds instead of popping
  const lag = (i % 4) * 0.06;
  const t = useTransform(p, (v) => Math.min(1, Math.max(0, (v - lag) / (1 - lag))));
  const x = useTransform(t, (v) => tool.x * v);
  const y = useTransform(t, (v) => -20 + (tool.y + 20) * v);
  const rotate = useTransform(t, (v) => tool.r * v);
  const scale = useTransform(t, (v) => 0.5 + 0.5 * v);
  const { Icon } = tool;
  return (
    <m.li className="absolute left-0 top-0" style={{ x, y, rotate, scale }}>
      <span
        className="lg-sm flex size-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[14px]"
        style={{ animation: `bob ${4.5 + (i % 3)}s ease-in-out ${-i * 0.7}s infinite` }}
        title={tool.name}
      >
        <Icon size={22} color={tool.color} aria-label={tool.name} />
      </span>
    </m.li>
  );
}
