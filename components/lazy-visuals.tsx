"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Decorative illustrations below the fold: their code loads and they mount only when they
 * get close to the viewport. The surrounding text stays in the server HTML, and the boxes
 * have fixed heights, so nothing shifts.
 */
function WhenNear({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className ?? "h-full w-full"}>
      {near ? children : null}
    </div>
  );
}

const Stories = {
  OneBoardStory: dynamic(() => import("./home/stories").then((m) => m.OneBoardStory), { ssr: false }),
  HoursToMinutesStory: dynamic(() => import("./home/stories").then((m) => m.HoursToMinutesStory), { ssr: false }),
  TrustedAnswerStory: dynamic(() => import("./home/stories").then((m) => m.TrustedAnswerStory), { ssr: false }),
  CleanDataStory: dynamic(() => import("./home/stories").then((m) => m.CleanDataStory), { ssr: false }),
};

export function LazyStory({ name }: { name: keyof typeof Stories }) {
  const Story = Stories[name];
  return (
    <WhenNear>
      <Story />
    </WhenNear>
  );
}

const Thumb = dynamic(() => import("./work-thumb").then((m) => m.WorkThumb), { ssr: false });

export function LazyWorkThumb({ slug }: { slug: string }) {
  return (
    <WhenNear className="h-40 w-full">
      <Thumb slug={slug} />
    </WhenNear>
  );
}
