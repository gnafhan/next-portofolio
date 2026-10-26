"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Mascot = dynamic(() => import("./mascot"), { ssr: false });

/** Loads Nafi only once the page is idle, so it never competes with the first paint. */
export function MascotLoader() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setOn(true), { timeout: 3000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setOn(true), 2000);
    return () => clearTimeout(t);
  }, []);
  return on ? <Mascot /> : null;
}
