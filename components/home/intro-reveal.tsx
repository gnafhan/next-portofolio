"use client";

import { useEffect, useRef } from "react";
import { LOGO_PATHS } from "../icons";

/*
 * Full-screen intro for the home page. The screen is covered except for an N-shaped window
 * (the logo, as tinted glass) through which the live page is already visible. Scrolling
 * (wheel, touch, keys) zooms into the N until it opens up and the page takes over.
 *
 * A tiny inline script decides before first paint whether to show it (not for reduced motion,
 * once per tab session), so there is no flash of content followed by a cover.
 */

const LOGO = { x: 58, y: 104, w: 340, h: 290 }; // logo viewBox
const CENTER = { x: LOGO.x + LOGO.w / 2, y: LOGO.y + LOGO.h / 2 };
const ZOOM = 70; // how far we zoom in by the end

const GATE = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(sessionStorage.getItem('intro-seen'))return;d.dataset.intro='on';}catch(e){}})();`;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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
    let touchY: number | null = null;

    const end = () => {
      if (done) return;
      done = true;
      target = 1;
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
      // let the last frames play, then hand the page back
      setTimeout(() => {
        html.style.overflow = "";
        html.style.removeProperty("--intro-p");
        delete html.dataset.intro;
      }, 650);
    };
    finish.current = end;

    const push = (delta: number) => {
      if (done) return;
      target = Math.min(1, Math.max(0, target + delta));
      if (target >= 0.85) end();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      push(e.deltaY / 1400);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      push((touchY - y) / 700);
      touchY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        push(0.25);
      }
      if (e.key === "Escape") end();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    const render = () => {
      raf = requestAnimationFrame(render);
      p += (target - p) * 0.12;
      if (done && p > 0.999) p = 1;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const base = (Math.min(vw, vh) * 0.42) / LOGO.h; // logo height = 42% of the short side
      const e = ease(p);
      const s = base * Math.exp(Math.log(ZOOM) * e);
      // anchor moves from the logo's centre to a point inside the diagonal stroke
      const ax = CENTER.x + (focus.x - CENTER.x) * Math.min(1, e * 2);
      const ay = CENTER.y + (focus.y - CENTER.y) * Math.min(1, e * 2);
      const t = `translate(${vw / 2} ${vh / 2}) scale(${s}) translate(${-ax} ${-ay})`;
      holeRef.current?.setAttribute("transform", t);
      rimRef.current?.setAttribute("transform", t);
      if (rimRef.current) rimRef.current.style.opacity = String(1 - Math.min(1, e * 1.4));
      if (textRef.current) textRef.current.style.opacity = String(Math.max(0, 1 - p * 4));
      if (skipRef.current) skipRef.current.style.opacity = String(Math.max(0, 1 - p * 3));
      if (rootRef.current) rootRef.current.style.opacity = done ? String(Math.max(0, 1 - (p - 0.9) * 10)) : "1";
      html.style.setProperty("--intro-p", String(e));
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = "";
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: GATE }} />
      <div ref={rootRef} className="intro-cover fixed inset-0 z-[60]">
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <mask id="intro-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <g ref={holeRef}>
                {LOGO_PATHS.map((l) => (
                  <path key={l.d.slice(0, 12)} d={l.d} fill="black" />
                ))}
              </g>
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" className="fill-[var(--bg)]" mask="url(#intro-mask)" />
          {/* stained-glass tint and a glass rim on the window */}
          <g ref={rimRef}>
            {LOGO_PATHS.map((l) => (
              <path key={l.d.slice(0, 12)} d={l.d} fill={l.fill} fillOpacity={0.16} stroke="white" strokeOpacity={0.55} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        </svg>

        <div ref={textRef} className="pointer-events-none absolute inset-x-0 bottom-[8vh] flex flex-col items-center gap-3 text-center">
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
