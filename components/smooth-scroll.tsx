"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth scrolling for mouse wheels and trackpads. Touch keeps native scrolling (syncTouch
 * off), so phones aren't affected. Elements with their own scroll (Nafi's chat, the certificate
 * lightbox) opt out with data-lenis-prevent. Reduced motion turns smoothing off (Lenis default).
 */
export function SmoothScroll() {
  const lenis = useLenis();
  useEffect(() => {
    window.__lenis = lenis;
    return () => {
      if (window.__lenis === lenis) window.__lenis = undefined;
    };
  }, [lenis]);
  return (
    <ReactLenis
      root
      options={{ autoRaf: true, lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: { offset: -80 }, stopInertiaOnNavigate: true }}
    />
  );
}

/** Scroll the page smoothly through Lenis when it's running, natively otherwise. */
export function smoothScrollTo(target: Element | number, { offset = 0, instant = false }: { offset?: number; instant?: boolean } = {}) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate: instant, duration: 1 });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: instant ? "auto" : "smooth" });
}
