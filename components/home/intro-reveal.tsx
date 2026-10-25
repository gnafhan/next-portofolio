"use client";

import { useEffect, useRef } from "react";
import { LOGO_PATHS } from "../icons";

/*
 * Full-screen intro for the home page.
 *
 * 1. Liquid (≈2.4s): the screen is covered; small liquid droplets of "window" open up, drift
 *    along the three strokes of the logo and melt together (an SVG gooey/metaball filter inside
 *    the mask), then settle into a stained-glass N. The live page is visible through them.
 * 2. Scroll to open: wheel / touch / keys zoom into the N until it opens and the page takes over.
 *
 * A tiny inline script decides before first paint whether to show it (not for reduced motion,
 * once per tab session), so there is no flash of content followed by a cover.
 */

const LOGO = { x: 58, y: 104, w: 340, h: 290 }; // logo viewBox
const CENTER = { x: LOGO.x + LOGO.w / 2, y: LOGO.y + LOGO.h / 2 };
const ZOOM = 70;
const LIQUID = 2.4; // seconds of droplet animation before "scroll to open"
const STROKE_COLORS = ["#557cbe", "#e94436", "#f8b916"]; // blue, red, yellow, as in the logo

// droplets settle on the three strokes of the N (logo coordinates)
const STROKES = [
  [[95, 340], [118, 290], [140, 240], [162, 190], [185, 140]],
  [[165, 132], [198, 186], [232, 240], [266, 295], [300, 350]],
  [[285, 345], [305, 295], [325, 245], [345, 195], [365, 145]],
];
const DROPS = STROKES.flatMap((s, k) =>
  s.map(([x, y], i) => {
    const a = (k * 5 + i) * 2.39996; // golden-angle scatter for the start positions
    const d = 150 + ((k * 5 + i) % 4) * 55;
    return { stroke: k, tx: x, ty: y, sx: CENTER.x + Math.cos(a) * d, sy: CENTER.y + Math.sin(a) * d * 0.8, delay: ((k * 5 + i) % 5) * 0.09 };
  }),
);

const GATE = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(sessionStorage.getItem('intro-seen'))return;d.dataset.intro='on';}catch(e){}})();`;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** A point inside the diagonal stroke, so zooming towards it fills the screen with glass. */
function findFocus() {
  const ctx = document.createElement("canvas").getContext("2d");
  const red = LOGO_PATHS.find((p) => p.fill === "#e94436") ?? LOGO_PATHS[0];
  const path = new Path2D(red.d);
  for (let r = 0; r < 60; r += 2) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
      const x = CENTER.x + Math.cos(a) * r;
      const y = CENTER.y - 14 + Math.sin(a) * r;
      if (ctx?.isPointInPath(path, x, y)) return { x, y };
    }
  }
  return CENTER;
}

export function IntroReveal() {
  const holeRef = useRef<SVGGElement>(null);
  const rimRef = useRef<SVGGElement>(null);
  const dropsRef = useRef<SVGGElement>(null);
  const dropTintRef = useRef<SVGGElement>(null);
  const dropShineRef = useRef<SVGGElement>(null);
  const nTintRef = useRef<SVGGElement>(null);
  const nHoleRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const finish = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro !== "on") return;
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";

    const focus = findFocus();
    let target = 0;
    let p = 0;
    let raf = 0;
    let done = false;
    let released = false;
    let touchY: number | null = null;
    let t0 = performance.now();

    const liquidT = () => (performance.now() - t0) / 1000;

    const detach = () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };

    const release = () => {
      if (released) return;
      released = true;
      detach();
      cancelAnimationFrame(raf);
      html.style.overflow = "";
      html.style.removeProperty("--intro-p");
      delete html.dataset.intro;
    };

    const end = () => {
      if (done) return;
      done = true;
      target = 1;
      detach(); // give scrolling back immediately; the last frames play on their own
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
      setTimeout(release, 650);
    };
    finish.current = end;

    const push = (delta: number) => {
      // scrolling during the liquid part fast-forwards it
      if (liquidT() < LIQUID) t0 -= (LIQUID - liquidT()) * 1000;
      target = clamp01(target + delta);
      if (target >= 0.85) end();
    };
    function onWheel(e: WheelEvent) {
      if (done) return;
      e.preventDefault();
      push(e.deltaY / 1400);
    }
    function onTouchStart(e: TouchEvent) {
      touchY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      if (done || touchY === null) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      push((touchY - y) / 700);
      touchY = y;
    }
    function onKey(e: KeyboardEvent) {
      if (done) return;
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        push(0.25);
      }
      if (e.key === "Escape") end();
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    const circles = () => Array.from(dropsRef.current?.querySelectorAll("circle") ?? []);
    const tints = () => Array.from(dropTintRef.current?.querySelectorAll("circle") ?? []);
    const shines = () => Array.from(dropShineRef.current?.querySelectorAll("circle") ?? []);

    const render = () => {
      raf = requestAnimationFrame(render);
      const lt = liquidT();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const base = (Math.min(vw, vh) * 0.42) / LOGO.h;

      // --- liquid phase: droplets drift onto the strokes and melt into the N
      const settle = clamp01((lt - 1.5) / 0.8); // droplets hand over to the real N shape
      const holes = circles();
      const tintCs = tints();
      const shineCs = shines();
      DROPS.forEach((d, i) => {
        const k = easeOut(clamp01((lt - d.delay) / 1.5));
        const wob = Math.sin(lt * 3 + i) * 6 * (1 - k);
        const x = d.sx + (d.tx - d.sx) * k + wob;
        const y = d.sy + (d.ty - d.sy) * k + Math.cos(lt * 2.6 + i) * 6 * (1 - k);
        const r = (6 + 24 * k) * (1 - settle);
        for (const c of [holes[i], tintCs[i]]) {
          if (!c) continue;
          c.setAttribute("cx", x.toFixed(1));
          c.setAttribute("cy", y.toFixed(1));
          c.setAttribute("r", Math.max(0, r).toFixed(1));
        }
        const sh = shineCs[i];
        if (sh) {
          sh.setAttribute("cx", (x - r * 0.3).toFixed(1));
          sh.setAttribute("cy", (y - r * 0.35).toFixed(1));
          sh.setAttribute("r", Math.max(0, r * 0.45).toFixed(1));
        }
      });
      if (nHoleRef.current) nHoleRef.current.style.opacity = String(settle);
      const glassIn = clamp01((lt - 1.7) / 0.6);

      // --- zoom phase
      p += (target - p) * 0.12;
      if (done && p > 0.999) p = 1;
      const e = ease(p);
      const s = base * Math.exp(Math.log(ZOOM) * e);
      const ax = CENTER.x + (focus.x - CENTER.x) * Math.min(1, e * 2);
      const ay = CENTER.y + (focus.y - CENTER.y) * Math.min(1, e * 2);
      const tf = `translate(${vw / 2} ${vh / 2}) scale(${s}) translate(${-ax} ${-ay})`;
      holeRef.current?.setAttribute("transform", tf);
      rimRef.current?.setAttribute("transform", tf);
      if (rimRef.current) rimRef.current.style.opacity = String(1 - Math.min(1, e * 1.4));
      if (nTintRef.current) nTintRef.current.style.opacity = String(glassIn);
      // the goo filter makes droplets opaque, so translucency is set on the whole layer
      if (dropTintRef.current) dropTintRef.current.style.opacity = String(0.42 * (1 - settle));
      if (dropShineRef.current) dropShineRef.current.style.opacity = String(0.35 * (1 - settle));

      const hint = clamp01((lt - LIQUID + 0.4) / 0.5);
      if (textRef.current) textRef.current.style.opacity = String(hint * Math.max(0, 1 - p * 4));
      if (skipRef.current) skipRef.current.style.opacity = String(Math.max(0, 1 - p * 3));
      if (rootRef.current) rootRef.current.style.opacity = done ? String(Math.max(0, 1 - (p - 0.9) * 10)) : "1";
      html.style.setProperty("--intro-p", String(e));
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      detach();
      html.style.overflow = "";
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: GATE }} />
      <div ref={rootRef} className="intro-cover fixed inset-0 z-[60]">
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            {/* metaball: blur, then cut the alpha sharply so nearby droplets melt together */}
            <filter id="intro-goo" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
            </filter>
            <mask id="intro-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <g ref={holeRef}>
                <g ref={dropsRef} filter="url(#intro-goo)">
                  {DROPS.map((_, i) => (
                    <circle key={i} r="0" fill="black" />
                  ))}
                </g>
                <g ref={nHoleRef} style={{ opacity: 0 }}>
                  {LOGO_PATHS.map((l) => (
                    <path key={l.d.slice(0, 12)} d={l.d} fill="black" />
                  ))}
                </g>
              </g>
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" className="fill-[var(--bg)]" mask="url(#intro-mask)" />
          <g ref={rimRef}>
            {/* glass tint on the liquid droplets */}
            <g ref={dropTintRef} filter="url(#intro-goo)">
              {DROPS.map((d, i) => (
                <circle key={i} r="0" fill={STROKE_COLORS[d.stroke]} />
              ))}
            </g>
            <g ref={dropShineRef} filter="url(#intro-goo)">
              {DROPS.map((_, i) => (
                <circle key={i} r="0" fill="white" />
              ))}
            </g>
            {/* stained-glass N with a thin glass rim */}
            <g ref={nTintRef} style={{ opacity: 0 }}>
              {LOGO_PATHS.map((l) => (
                <path key={l.d.slice(0, 12)} d={l.d} fill={l.fill} fillOpacity={0.16} stroke="white" strokeOpacity={0.55} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          </g>
        </svg>

        <div ref={textRef} className="pointer-events-none absolute inset-x-0 bottom-[8vh] flex flex-col items-center gap-3 text-center" style={{ opacity: 0 }}>
          <span className="text-[0.95rem] font-medium tracking-tight">Ghifari Nafhan</span>
          <span className="flex items-center gap-2 text-[0.85rem] text-ink-3">
            <span className="intro-hint inline-block">↓</span> Scroll to open
          </span>
        </div>
        <button
          ref={skipRef}
          type="button"
          onClick={() => finish.current()}
          className="lg absolute right-5 top-5 rounded-full px-4 py-1.5 text-[0.85rem] text-ink-2 hover:text-ink"
        >
          Skip intro
        </button>
      </div>
    </>
  );
}
