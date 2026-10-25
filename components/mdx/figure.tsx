"use client";

import { useRef, useState } from "react";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "figure";
}

async function renderPng(node: HTMLElement) {
  const { toBlob } = await import("html-to-image");
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--surface-solid").trim() || "#ffffff";
  const blob = await toBlob(node, {
    pixelRatio: 2,
    backgroundColor: bg,
    filter: (el) => !(el instanceof HTMLElement && el.dataset.figActions !== undefined),
  });
  if (!blob) throw new Error("Could not render figure");
  return blob;
}

/**
 * A titled illustration with "copy PNG" and "download PNG" actions.
 * Wrap any diagram (Flow, Mermaid, an <img>, raw SVG, a chart) in it.
 */
export function Figure({
  title,
  sub,
  caption,
  children,
}: {
  title?: string;
  sub?: string;
  caption?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  const flash = (msg: string) => {
    setStatus(msg);
    window.setTimeout(() => setStatus(null), 1600);
  };

  const download = async () => {
    if (!ref.current) return;
    try {
      const blob = await renderPng(ref.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(title ?? "figure")}.png`;
      a.click();
      URL.revokeObjectURL(url);
      flash("saved");
    } catch {
      flash("failed");
    }
  };

  const copy = async () => {
    if (!ref.current) return;
    try {
      const node = ref.current;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": renderPng(node) })]);
      flash("copied");
    } catch {
      flash("copy failed");
    }
  };

  return (
    <figure
      ref={ref}
      className="fig glass not-prose my-8 overflow-hidden rounded-[22px]"
    >
      {(title || sub) && (
        <div className="flex items-start justify-between gap-4 px-5 pt-4">
          <div>
            {title && <div className="text-[0.98rem] font-semibold leading-snug">{title}</div>}
            {sub && <div className="mt-0.5 text-[0.85rem] text-ink-3">{sub}</div>}
          </div>
          <div data-fig-actions="" className="flex shrink-0 items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider">
            {status ? (
              <span className="px-1.5 py-1 text-accent">{status}</span>
            ) : (
              <>
                <button type="button" onClick={copy} className="rounded px-1.5 py-1 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Copy figure as PNG">
                  copy
                </button>
                <button type="button" onClick={download} className="rounded px-1.5 py-1 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Download figure as PNG">
                  png
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="overflow-x-auto px-5 py-5">{children}</div>
      {caption && (
        <figcaption className="flex gap-4 border-t border-line px-5 py-3 text-[0.9rem] text-ink-2">
          <span className="fig-label shrink-0 font-mono text-[0.7rem] uppercase tracking-wider text-ink-3 leading-6" />
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
