"use client";

import { useEffect, useRef, useState } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import type { Certificate } from "@/lib/certificates";
import { CertFace } from "./cert-face";

type Mode = "hero" | "mini";

// small, deterministic scatter so the pile looks hand-dropped (same on server and client)
const jitter = (i: number, k: number) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v) - 0.5;
};

/**
 * A pile of certificates that fans out into an arc as you scroll, like a hand of cards.
 * "hero" spreads over the first few hundred pixels of the page; "mini" spreads as it reaches
 * the middle of the screen.
 */
export function CertPile({ certs, mode = "hero" }: { certs: Certificate[]; mode?: Mode }) {
  const ref = useRef<HTMLDivElement>(null);
  const calm = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll(
    mode === "mini" ? { target: ref, offset: ["start end", "center 55%"] } : undefined,
  );
  const raw = useTransform(mode === "mini" ? scrollYProgress : scrollY, mode === "mini" ? [0, 1] : [0, 340], [0, 1], { clamp: true });
  const spring = useSpring(raw, { stiffness: 110, damping: 22, mass: 0.6 });
  const p = calm ? raw : spring;
  const n = certs.length;
  // the fan shrinks to the width available (phones get a tighter arc)
  const [spread, setSpread] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSpread(Math.min(1, el.clientWidth / (mode === "hero" ? 1100 : 560))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  return (
    <div
      ref={ref}
      className={mode === "hero" ? "relative mx-auto h-[300px] w-full sm:h-[420px]" : "relative mx-auto h-[230px] w-full"}
    >
      {certs.map((c, i) => (
        <PileCard key={c.title} cert={c} i={i} n={n} p={p} mode={mode} spread={spread} />
      ))}
    </div>
  );
}

function PileCard({ cert, i, n, p, mode, spread }: { cert: Certificate; i: number; n: number; p: MotionValue<number>; mode: Mode; spread: number }) {
  const hero = mode === "hero";
  // fan geometry: an arc below the pile's centre
  const t = n === 1 ? 0.5 : i / (n - 1);
  const angle = (t - 0.5) * (hero ? 70 : 50);
  const R = (hero ? 620 : 380) * spread;
  const rad = (angle * Math.PI) / 180;
  const fx = Math.sin(rad) * R * (hero ? 1 : 0.9);
  const fy = (1 - Math.cos(rad)) * R * 0.55 - (hero ? 30 : 10);
  const px = Math.round(jitter(i, 1) * 26);
  const py = Math.round(jitter(i, 2) * 18);
  const pr = Math.round(jitter(i, 3) * 16);

  const x = useTransform(p, (v) => px + (fx - px) * v);
  const y = useTransform(p, (v) => py + (fy - py) * v);
  const rotate = useTransform(p, (v) => pr + (angle * 0.7 - pr) * v);

  return (
    <m.div
      className="absolute left-1/2 top-[42%]"
      style={{ x, y, rotate, zIndex: i }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * (n - i), duration: 0.45, ease: "easeOut" }}
    >
      <m.div
        whileHover={{ y: -14, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={`relative -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-line bg-[var(--surface)] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)] ${
          hero ? "w-[190px] text-[11px] sm:w-[300px] sm:text-[15px]" : "w-[150px] text-[9px] sm:w-[170px]"
        }`}
        style={{ aspectRatio: "1.414" }}
      >
        <CertFace cert={cert} sizes={hero ? "(min-width: 640px) 300px, 190px" : "170px"} priority={hero && i >= n - 3} />
      </m.div>
    </m.div>
  );
}
