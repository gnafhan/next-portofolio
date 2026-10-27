"use client";

import { useEffect, useRef } from "react";
import { Logo } from "../icons";

/**
 * A thread that is drawn down the home page as you scroll, carrying a small glass "N" at its tip
 * (the drop the intro zoomed through). It runs down the side gutters and swings across between
 * sections, so there is always something moving with the reader from the hero to the footer.
 *
 * Purely scroll-linked: nothing animates on its own. Placed as the first child of the page
 * container (which must be `relative isolate`); it reads that container's <section>s.
 */
const STEP = 10; // px of path length between samples

export function ScrollThread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const track = trackRef.current;
    const draw = drawRef.current;
    const tip = tipRef.current;
    const box = svg?.parentElement?.parentElement; // the page container
    if (!svg || !track || !draw || !tip || !box) return;
    // phones: hidden (the gutters are only 8px wide), so don't spend any work on it
    if (!window.matchMedia("(min-width: 640px)").matches) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let total = 0;
    let len = 0;
    let goal = 0;
    let shift = 0; // svg x offset relative to the container
    let raf = 0;
    let boxTop = 0;
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);

    const layout = () => {
      const r = box.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(box).paddingLeft) || 16;
      const m = Math.max(0, Math.min((window.innerWidth - r.width) / 2, 72));
      shift = m;
      const W = r.width + 2 * m;
      svg.style.left = `${-m}px`;
      svg.style.width = `${W}px`;
      svg.style.height = `${r.height}px`;
      svg.setAttribute("viewBox", `0 0 ${W} ${r.height}`);

      // gutters: the middle of the empty strip either side of the content
      const gut = (pad + m) / 2;
      const sides = [gut, W - gut];
      const secs = Array.from(box.children).filter((c) => c.tagName === "SECTION") as HTMLElement[];
      if (secs.length < 2) return;
      const top = (el: HTMLElement) => el.getBoundingClientRect().top - r.top;
      const bottom = (el: HTMLElement) => el.getBoundingClientRect().bottom - r.top;
      const gaps = secs.slice(1).map((s, i) => (bottom(secs[i]) + top(s)) / 2);
      const D = Math.min(150, (gaps[1] - gaps[0]) / 3 || 150);

      // start just under the hero, swing out to a gutter, cross sides between sections, and finish in
      // the open space above the footer (outside the container, the svg does not clip)
      const y0 = bottom(secs[0]) - 8;
      let side = 0;
      let d = `M ${W * 0.5} ${y0} C ${W * 0.5} ${y0 + D * 0.8} ${sides[side]} ${gaps[0]} ${sides[side]} ${gaps[0] + D}`;
      for (let i = 1; i < gaps.length; i++) {
        const next = 1 - side;
        d += ` L ${sides[side]} ${gaps[i] - D} C ${sides[side]} ${gaps[i]} ${sides[next]} ${gaps[i]} ${sides[next]} ${gaps[i] + D}`;
        side = next;
      }
      const end = r.height + 96;
      d += ` L ${sides[side]} ${r.height - 24} C ${sides[side]} ${end - 20} ${W * 0.5} ${r.height} ${W * 0.5} ${end}`;
      track.setAttribute("d", d);
      draw.setAttribute("d", d);
      total = draw.getTotalLength();
      draw.style.strokeDasharray = `${total} ${total}`;
      // sample the path once, so scrolling never has to ask the SVG engine for geometry
      const n = Math.max(2, Math.ceil(total / STEP) + 1);
      xs = new Float32Array(n);
      ys = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const pt = draw.getPointAtLength(Math.min(total, i * STEP));
        xs[i] = pt.x;
        ys[i] = pt.y;
      }
      boxTop = r.top + window.scrollY;
      tip.style.setProperty("--tip", window.innerWidth < 640 ? "22px" : "30px");
      onScroll();
      len = goal;
      paint();
    };

    // the path only ever goes down, so the length at a given height is a bisection over the samples
    const lengthAtY = (y: number) => {
      let lo = 0, hi = ys.length - 1;
      if (y <= ys[0]) return 0;
      if (y >= ys[hi]) return total;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid;
        else hi = mid;
      }
      const f = (y - ys[lo]) / Math.max(1e-3, ys[hi] - ys[lo]);
      return Math.min(total, (lo + f) * STEP);
    };
    const pointAt = (l: number) => {
      const t = Math.min(xs.length - 1, Math.max(0, l / STEP));
      const i = Math.min(xs.length - 2, Math.floor(t));
      const f = t - i;
      return [xs[i] + (xs[i + 1] - xs[i]) * f, ys[i] + (ys[i + 1] - ys[i]) * f];
    };

    function onScroll() {
      if (!total) return;
      goal = lengthAtY(window.scrollY + window.innerHeight * 0.62 - boxTop);
      if (!raf) raf = requestAnimationFrame(tick);
    }

    const paint = () => {
      draw.style.strokeDashoffset = String(total - len);
      const [px, py] = pointAt(len);
      const [qx, qy] = pointAt(Math.min(total, len + 6));
      const lean = (Math.atan2(qx - px, qy - py) * -180) / Math.PI;
      tip.style.transform = `translate3d(${px - shift}px, ${py}px, 0) translate(-50%, -50%) rotate(${lean * 0.35}deg)`;
      tip.style.opacity = "1";
    };

    const tick = () => {
      raf = 0;
      len += (goal - len) * (calm ? 1 : 0.14);
      if (Math.abs(goal - len) < 0.3) len = goal;
      paint();
      if (len !== goal) raf = requestAnimationFrame(tick);
    };

    let pending = 0;
    const relayout = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(layout);
    };
    const ro = new ResizeObserver(relayout);
    ro.observe(box);
    window.addEventListener("scroll", onScroll, { passive: true });
    // phones fire resize whenever the address bar shows or hides; only a width change moves the path
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      relayout();
    };
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(pending);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden sm:block">
      <svg ref={svgRef} className="absolute top-0 overflow-visible">
        <path ref={trackRef} className="fill-none stroke-[var(--line-strong)]" strokeWidth={1.25} strokeDasharray="2 7" strokeLinecap="round" />
        <path ref={drawRef} className="fill-none stroke-[var(--accent)]" strokeWidth={2} strokeLinecap="round" opacity={0.75} />
      </svg>
      <div
        ref={tipRef}
        className="lg-sm absolute left-0 top-0 grid place-items-center rounded-[30%] will-change-transform"
        style={{ width: "var(--tip, 30px)", height: "var(--tip, 30px)", opacity: 0 }}
      >
        <Logo size={16} />
      </div>
    </div>
  );
}
