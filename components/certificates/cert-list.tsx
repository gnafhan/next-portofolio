"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { Certificate } from "@/lib/certificates";
import { formatCertDate } from "@/lib/certificates";
import { CertFace } from "./cert-face";

type Group = { issuer: string; items: Certificate[] };

/** Certificates grouped by issuer. Thumbnails open the full certificate in a lightbox. */
export function CertList({ groups }: { groups: Group[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Certificate | null>(null);
  const show = (c: Certificate) => {
    setOpen(c);
    dialog.current?.showModal();
  };

  return (
    <>
      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.issuer} data-agent={`issuer-${slug(g.issuer)}`} aria-labelledby={`issuer-${slug(g.issuer)}`}>
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
              <h2 id={`issuer-${slug(g.issuer)}`} className="text-[1.35rem] font-medium tracking-tight">
                {g.issuer}
              </h2>
              <span className="text-[0.9rem] text-ink-3">
                {g.items.length} {g.items.length === 1 ? "certificate" : "certificates"}
              </span>
            </div>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {g.items.map((c) => (
                <li key={c.title} data-agent={`cert-${slug(c.title)}`} className="glass flex items-center gap-4 rounded-2xl p-3">
                  <button
                    type="button"
                    onClick={() => show(c)}
                    className="relative w-[104px] shrink-0 overflow-hidden rounded-lg border border-line text-[6px] transition-transform hover:-rotate-2 hover:scale-105"
                    style={{ aspectRatio: "1.414" }}
                    aria-label={`View ${c.title} certificate`}
                  >
                    <CertFace cert={c} sizes="104px" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium leading-snug">{c.title}</div>
                    <div className="mt-1 flex flex-wrap gap-x-3 text-[0.85rem] text-ink-3">
                      {c.date && <span>{formatCertDate(c.date)}</span>}
                      {c.id && <span className="truncate">ID {c.id.length > 16 ? `${c.id.slice(0, 13)}…` : c.id}</span>}
                    </div>
                  </div>
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener"
                      className="lg-sm flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[0.82rem] hover:text-accent"
                      aria-label={`Verify ${c.title}`}
                    >
                      Verify <ArrowUpRight size={13} aria-hidden />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto w-[min(92vw,960px)] overflow-visible bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        aria-label={open ? `${open.title} certificate` : "Certificate"}
      >
        {open && (
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-[var(--surface)] text-[22px]" style={{ aspectRatio: "1.414" }}>
              <CertFace cert={open} sizes="(min-width: 1000px) 960px, 92vw" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-white">
              <div className="min-w-0">
                <div className="truncate font-medium">{open.title}</div>
                <div className="text-[0.85rem] text-white/75">{open.issuer}</div>
              </div>
              <button type="button" onClick={() => dialog.current?.close()} className="lg flex size-10 shrink-0 items-center justify-center rounded-full text-ink" aria-label="Close">
                <X size={18} aria-hidden />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
