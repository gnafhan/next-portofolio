"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Renders a mermaid diagram on the client, themed from the site's CSS variables. */
export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState(false);
  const [theme, setTheme] = useState<string | null>(null);
  const seq = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  // Mermaid scales wide diagrams down to fit, which makes labels unreadable.
  // Render at natural size instead; the figure scrolls horizontally if needed.
  useLayoutEffect(() => {
    const el = box.current?.querySelector("svg");
    const vb = el?.viewBox?.baseVal;
    const container = box.current?.clientWidth ?? 0;
    if (el && vb?.width && container) {
      // Shrink to fit only while labels stay readable (>= 70% size).
      const target = Math.max(Math.min(vb.width, container), vb.width * 0.7);
      el.style.maxWidth = "none";
      el.style.width = `${Math.round(target)}px`;
    }
  }, [svg]);

  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme ?? "light");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!theme) return;
    let cancelled = false;
    const run = ++seq.current;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: cssVar("--font-geist-sans") || "ui-sans-serif, system-ui",
          themeVariables: {
            background: cssVar("--surface"),
            primaryColor: cssVar("--surface-2"),
            primaryTextColor: cssVar("--ink"),
            primaryBorderColor: cssVar("--line-strong"),
            lineColor: cssVar("--ink-3"),
            secondaryColor: cssVar("--accent-soft"),
            tertiaryColor: cssVar("--surface"),
            clusterBkg: cssVar("--bg"),
            clusterBorder: cssVar("--line"),
            edgeLabelBackground: cssVar("--surface"),
            fontSize: "14px",
          },
        });
        const { svg } = await mermaid.render(`m${id}${run}`, chart.trim());
        if (!cancelled) {
          setSvg(svg);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id, theme]);

  if (error) {
    return <pre className="overflow-x-auto text-sm text-ink-2">{chart}</pre>;
  }
  return (
    <div
      ref={box}
      className="mermaid-diagram min-h-24 [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto"
      role="img"
      aria-label="Diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
