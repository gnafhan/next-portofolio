"use client";

import { useRef, useState } from "react";

export function Pre(props: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative">
      <pre ref={ref} {...props} />
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(ref.current?.innerText ?? "");
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        }}
        className="absolute right-2 top-2 lg rounded-full px-2.5 py-0.5 text-[0.72rem] text-ink-2 opacity-0 transition group-hover:opacity-100 focus:opacity-100"
        aria-label="Copy code"
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
