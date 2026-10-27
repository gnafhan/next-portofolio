"use client";

import { useEffect } from "react";

/**
 * Counts clicks on links that leave the site as Plausible's "Outbound Link: Click" goal. Replaces
 * the outbound-links script variant, which watched every DOM change for new links and cost a lot
 * of main-thread time on a page full of animations. One delegated listener does the same job.
 */
export function OutboundTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.host === location.host || !/^https?:/.test(a.protocol)) return;
      const plausible = (window as unknown as { plausible?: (n: string, o?: { props?: Record<string, string> }) => void }).plausible;
      plausible?.("Outbound Link: Click", { props: { url: a.href } });
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
