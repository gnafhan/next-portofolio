"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content";

export function Toc({ headings, minutes }: { headings: Heading[]; minutes: number }) {
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const article = document.querySelector("article");
      if (article) {
        const rect = article.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        setProgress(total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1);
      }
      let current: string | null = null;
      for (const el of els) if (el.getBoundingClientRect().top < 120) current = el.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  const pct = Math.round(progress * 100);
  const blocks = 12;
  const filled = Math.round(progress * blocks);

  return (
    <div className="text-[0.88rem]">
      {headings.length > 0 && (
        <>
          <div className="label mb-3">Contents</div>
          <ul className="space-y-1.5">
            {headings.map((h) => (
              <li key={h.id} className={h.depth === 3 ? "pl-3" : ""}>
                <a
                  href={`#${h.id}`}
                  className={`block border-l-2 pl-3 leading-snug transition-colors ${active === h.id ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink-2"}`}
                >
                  <span className="line-clamp-2">{h.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-6 flex items-center gap-3" aria-label={`${pct}% read`}>
        <span aria-hidden className="flex gap-[2px]">
          {Array.from({ length: blocks }, (_, i) => (
            <span key={i} className={`h-1.5 w-3 rounded-full ${i < filled ? "bg-accent" : "bg-line-strong"}`} />
          ))}
        </span>
        <span className="tabular-nums text-ink-3">{pct}%</span>
      </div>
      <div className="mt-2 text-ink-3">{minutes} min read</div>
    </div>
  );
}
