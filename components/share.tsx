"use client";

import { useState } from "react";

export function Share({ url, title, markdownUrl }: { url: string; title: string; markdownUrl?: string }) {
  const [done, setDone] = useState<string | null>(null);
  const flash = (k: string) => {
    setDone(k);
    setTimeout(() => setDone(null), 1500);
  };
  const enc = encodeURIComponent;
  const linkCls = "flex gap-2 text-ink-3 hover:text-ink";
  return (
    <div className="text-[0.88rem]">
      <div className="label mb-3">Share</div>
      <ul className="space-y-2">
        <li>
          <a className={linkCls} href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </li>
        <li>
          <a className={linkCls} href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener">
            X.com
          </a>
        </li>
        <li>
          <a className={linkCls} href={`mailto:?subject=${enc(title)}&body=${enc(url)}`}>
            Email
          </a>
        </li>
        <li>
          <button
            type="button"
            className={linkCls}
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              flash("url");
            }}
          >
            {done === "url" ? "Copied" : "Copy URL"}
          </button>
        </li>
        {markdownUrl && (
          <li>
            <button
              type="button"
              className={linkCls}
              onClick={async () => {
                const text = fetch(markdownUrl).then((r) => r.text()).then((t) => new Blob([t], { type: "text/plain" }));
                await navigator.clipboard.write([new ClipboardItem({ "text/plain": text })]);
                flash("md");
              }}
            >
              {done === "md" ? "Copied" : "Copy markdown"}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
