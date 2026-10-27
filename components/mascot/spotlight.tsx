"use client";

import { useEffect, useRef } from "react";

/**
 * Dims the page except one element, with an accent ring around it. Follows the element while the
 * page scrolls; moves by transform only so it stays on the compositor.
 */
export function Spotlight({ target }: { target: Element | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!target) {
      el.style.opacity = "0";
      return;
    }
    let raf = 0;
    let w = 0;
    let h = 0;
    const pad = 10;
    const follow = () => {
      const r = target.getBoundingClientRect();
      const nw = Math.round(r.width + pad * 2);
      const nh = Math.round(r.height + pad * 2);
      if (nw !== w || nh !== h) {
        w = nw;
        h = nh;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
      }
      el.style.transform = `translate3d(${r.left - pad}px, ${r.top - pad}px, 0)`;
      raf = requestAnimationFrame(follow);
    };
    follow();
    el.style.opacity = "1";
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[48] rounded-[20px] opacity-0 outline outline-2 outline-offset-0 outline-[var(--accent)] transition-opacity duration-300 will-change-transform"
      style={{ boxShadow: "0 0 0 100vmax rgba(9, 9, 14, 0.38)" }}
    />
  );
}
